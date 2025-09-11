/**
 * Order Fulfillment Service
 * Comprehensive pick-pack-ship operations with Oracle EBS competitive features
 */

import type {
  SalesOrder,
  OrderLineItem,
  Shipment,
  PackageDetail,
  PackageItem,
  ShipmentLineItem,
  OrderAllocation,
  OrderAddress,
} from '../../types';

import { ShipmentStatus, Priority } from '../../types';

export interface PickList {
  id: string;
  pickListNumber: string;
  orderId: string;
  warehouseId: string;
  status: 'GENERATED' | 'RELEASED' | 'PICKED' | 'CANCELLED';
  priority: Priority;
  assignedTo?: string;
  generatedDate: Date;
  releasedDate?: Date;
  pickedDate?: Date;
  estimatedPickTime: number; // in minutes
  actualPickTime?: number;
  pickInstructions: PickInstruction[];
  notes?: string;
  createdBy: string;
  modifiedBy: string;
}

export interface PickInstruction {
  lineNumber: number;
  orderLineItemId: string;
  itemCode: string;
  itemDescription: string;
  quantityToPick: number;
  quantityPicked: number;
  unitOfMeasure: string;
  warehouseLocation: string;
  zone?: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
  lotNumber?: string;
  serialNumber?: string;
  expirationDate?: Date;
  pickSequence: number;
  specialInstructions?: string;
  substitutionAllowed: boolean;
  alternativeItems?: string[];
  status: 'PENDING' | 'PICKED' | 'SHORT' | 'DAMAGED' | 'SUBSTITUTED';
}

export interface PackingSlip {
  id: string;
  packingSlipNumber: string;
  orderId: string;
  shipmentId?: string;
  warehouseId: string;
  status: 'GENERATED' | 'PACKED' | 'SHIPPED';
  packageDetails: PackageDetail[];
  packingInstructions?: string;
  specialHandling?: string[];
  hazardousMaterial: boolean;
  packingDate?: Date;
  packedBy?: string;
  totalPackages: number;
  totalWeight: number;
  totalVolume: number;
  createdDate: Date;
  modifiedDate: Date;
}

export class OrderFulfillmentService {
  // ================================
  // PICK OPERATIONS
  // ================================

  /**
   * Generate pick list for order with advanced warehouse optimization
   */
  async generatePickList(
    orderId: string,
    warehouseId: string,
    options?: {
      priority?: Priority;
      preferredPicker?: string;
      optimizationStrategy?: 'SHORTEST_PATH' | 'ZONE_BASED' | 'BATCH_PICK';
      allowSubstitutions?: boolean;
      consolidateItems?: boolean;
    }
  ): Promise<PickList> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Validate order can be picked
    await this.validateOrderForPicking(order);

    // Get inventory allocations
    const allocations = await this.getOrderAllocations(orderId, warehouseId);

    // Generate optimized pick instructions
    const pickInstructions = await this.generateOptimizedPickInstructions(
      order.lineItems,
      allocations,
      warehouseId,
      options?.optimizationStrategy || 'SHORTEST_PATH'
    );

    // Calculate estimated pick time
    const estimatedPickTime = this.calculatePickTime(pickInstructions, warehouseId);

    const pickList: PickList = {
      id: `pick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pickListNumber: `PL${Date.now().toString().slice(-8)}`,
      orderId,
      warehouseId,
      status: 'GENERATED',
      priority: options?.priority || order.priority,
      assignedTo: options?.preferredPicker,
      generatedDate: new Date(),
      estimatedPickTime,
      pickInstructions,
      createdBy: 'SYSTEM', // Would be actual user in real implementation
      modifiedBy: 'SYSTEM',
    };

    return pickList;
  }

  /**
   * Release pick list to warehouse floor
   */
  async releasePickList(
    pickListId: string,
    releasedBy: string,
    assignedTo?: string
  ): Promise<PickList> {
    const pickList = await this.getPickListById(pickListId);
    if (!pickList) {
      throw new Error(`Pick list ${pickListId} not found`);
    }

    if (pickList.status !== 'GENERATED') {
      throw new Error(`Pick list ${pickList.pickListNumber} is not in generated status`);
    }

    const updatedPickList: PickList = {
      ...pickList,
      status: 'RELEASED',
      releasedDate: new Date(),
      assignedTo: assignedTo || pickList.assignedTo,
      modifiedBy: releasedBy,
    };

    return updatedPickList;
  }

  /**
   * Record pick completion with quantity and quality validations
   */
  async recordPickCompletion(
    pickListId: string,
    pickResults: Array<{
      instructionLineNumber: number;
      quantityPicked: number;
      lotNumber?: string;
      serialNumber?: string;
      condition?: 'GOOD' | 'DAMAGED' | 'EXPIRED';
      substitutionUsed?: boolean;
      alternativeItemCode?: string;
      notes?: string;
    }>,
    pickedBy: string
  ): Promise<PickList> {
    const pickList = await this.getPickListById(pickListId);
    if (!pickList) {
      throw new Error(`Pick list ${pickListId} not found`);
    }

    // Update pick instructions with results
    const updatedInstructions = pickList.pickInstructions.map((instruction) => {
      const result = pickResults.find((r) => r.instructionLineNumber === instruction.lineNumber);
      if (result) {
        let status: 'PENDING' | 'PICKED' | 'SHORT' | 'DAMAGED' | 'SUBSTITUTED' = 'PICKED';

        if (result.quantityPicked < instruction.quantityToPick) {
          status = 'SHORT';
        } else if (result.condition === 'DAMAGED') {
          status = 'DAMAGED';
        } else if (result.substitutionUsed) {
          status = 'SUBSTITUTED';
        }

        return {
          ...instruction,
          quantityPicked: result.quantityPicked,
          lotNumber: result.lotNumber || instruction.lotNumber,
          serialNumber: result.serialNumber || instruction.serialNumber,
          status,
          specialInstructions: result.notes
            ? `${instruction.specialInstructions || ''} ${result.notes}`.trim()
            : instruction.specialInstructions,
        };
      }
      return instruction;
    });

    const actualPickTime = this.calculateActualPickTime(pickList.releasedDate!, new Date());
    const allPicked = updatedInstructions.every((inst) => inst.status !== 'PENDING');

    const updatedPickList: PickList = {
      ...pickList,
      status: allPicked ? 'PICKED' : pickList.status,
      pickInstructions: updatedInstructions,
      pickedDate: allPicked ? new Date() : undefined,
      actualPickTime: allPicked ? actualPickTime : undefined,
      modifiedBy: pickedBy,
    };

    // Handle shortages and substitutions
    if (updatedInstructions.some((inst) => inst.status === 'SHORT')) {
      await this.handlePickShortages(pickListId, updatedInstructions);
    }

    return updatedPickList;
  }

  // ================================
  // PACK OPERATIONS
  // ================================

  /**
   * Generate packing slip with optimized packaging strategy
   */
  async generatePackingSlip(
    orderId: string,
    pickListId: string,
    packagingStrategy?: {
      packagingType?: 'MINIMUM_PACKAGES' | 'ITEM_PROTECTION' | 'SHIPPING_COST';
      allowMixedItems?: boolean;
      maxPackageWeight?: number;
      preferredCarrier?: string;
    }
  ): Promise<PackingSlip> {
    const order = await this.getOrderById(orderId);
    const pickList = await this.getPickListById(pickListId);

    if (!order || !pickList) {
      throw new Error('Order or pick list not found');
    }

    if (pickList.status !== 'PICKED') {
      throw new Error('Pick list must be completed before packing');
    }

    // Generate optimal packaging plan
    const packageDetails = await this.generateOptimalPackaging(
      pickList.pickInstructions,
      order.shippingAddress,
      packagingStrategy
    );

    // Check for hazardous materials
    const hazardousMaterial = await this.checkForHazardousMaterials(pickList.pickInstructions);

    const packingSlip: PackingSlip = {
      id: `pack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      packingSlipNumber: `PS${Date.now().toString().slice(-8)}`,
      orderId,
      warehouseId: pickList.warehouseId,
      status: 'GENERATED',
      packageDetails,
      packingInstructions: this.generatePackingInstructions(packageDetails),
      specialHandling: await this.getSpecialHandlingRequirements(order, pickList.pickInstructions),
      hazardousMaterial,
      totalPackages: packageDetails.length,
      totalWeight: packageDetails.reduce((sum, pkg) => sum + pkg.weight, 0),
      totalVolume: packageDetails.reduce(
        (sum, pkg) => sum + pkg.dimensions.length * pkg.dimensions.width * pkg.dimensions.height,
        0
      ),
      createdDate: new Date(),
      modifiedDate: new Date(),
    };

    return packingSlip;
  }

  /**
   * Record pack completion with tracking numbers
   */
  async recordPackCompletion(
    packingSlipId: string,
    packageResults: Array<{
      packageNumber: string;
      actualWeight: number;
      actualDimensions?: {
        length: number;
        width: number;
        height: number;
        unit?: 'IN' | 'CM' | 'FT' | 'M';
      };
      trackingNumber?: string;
      carrierPackageId?: string;
      specialHandlingApplied?: string[];
    }>,
    packedBy: string
  ): Promise<PackingSlip> {
    const packingSlip = await this.getPackingSlipById(packingSlipId);
    if (!packingSlip) {
      throw new Error(`Packing slip ${packingSlipId} not found`);
    }

    // Update package details with actual results
    const updatedPackageDetails = packingSlip.packageDetails.map((pkg) => {
      const result = packageResults.find((r) => r.packageNumber === pkg.packageNumber);
      if (result) {
        return {
          ...pkg,
          weight: result.actualWeight,
          dimensions: result.actualDimensions
            ? {
                ...result.actualDimensions,
                unit: result.actualDimensions.unit || pkg.dimensions.unit,
              }
            : pkg.dimensions,
          trackingNumber: result.trackingNumber,
        };
      }
      return pkg;
    });

    const updatedPackingSlip: PackingSlip = {
      ...packingSlip,
      status: 'PACKED',
      packageDetails: updatedPackageDetails,
      packingDate: new Date(),
      packedBy,
      totalWeight: updatedPackageDetails.reduce((sum, pkg) => sum + pkg.weight, 0),
      modifiedDate: new Date(),
    };

    return updatedPackingSlip;
  }

  // ================================
  // SHIP OPERATIONS
  // ================================

  /**
   * Create shipment from packed order
   */
  async createShipment(
    orderId: string,
    packingSlipId: string,
    shippingOptions: {
      carrierId: string;
      carrierName: string;
      shippingMethod: string;
      serviceLevel?: string;
      requestedShipDate?: Date;
      specialInstructions?: string;
      insuredValue?: number;
      signatureRequired?: boolean;
      saturdayDelivery?: boolean;
    },
    createdBy: string
  ): Promise<Shipment> {
    const order = await this.getOrderById(orderId);
    const packingSlip = await this.getPackingSlipById(packingSlipId);

    if (!order || !packingSlip) {
      throw new Error('Order or packing slip not found');
    }

    if (packingSlip.status !== 'PACKED') {
      throw new Error('Packing slip must be completed before shipping');
    }

    // Generate shipment line items from pick instructions
    const shipmentLineItems = await this.generateShipmentLineItems(order, packingSlip);

    // Calculate delivery estimates
    const deliveryEstimate = await this.calculateDeliveryEstimate(
      order.shippingAddress,
      shippingOptions.carrierId,
      shippingOptions.shippingMethod
    );

    const shipment: Shipment = {
      id: `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shipmentNumber: `SH${Date.now().toString().slice(-8)}`,
      orderId,
      status: ShipmentStatus.PLANNED,
      shipmentType: 'STANDARD',
      warehouseId: packingSlip.warehouseId,
      carrierId: shippingOptions.carrierId,
      carrierName: shippingOptions.carrierName,
      shippingMethod: shippingOptions.shippingMethod,
      serviceLevel: shippingOptions.serviceLevel,
      plannedShipDate: shippingOptions.requestedShipDate || new Date(),
      estimatedDeliveryDate: deliveryEstimate,
      shippingAddress: order.shippingAddress,
      packageDetails: packingSlip.packageDetails,
      lineItems: shipmentLineItems,
      totalWeight: packingSlip.totalWeight,
      totalVolume: packingSlip.totalVolume,
      shippingCost: await this.calculateShippingCost(
        packingSlip.packageDetails,
        order.shippingAddress,
        shippingOptions
      ),
      insuredValue: shippingOptions.insuredValue,
      insuredAmount: shippingOptions.insuredValue
        ? await this.calculateInsuranceCost(shippingOptions.insuredValue)
        : undefined,
      hazardousMaterial: packingSlip.hazardousMaterial,
      specialInstructions: shippingOptions.specialInstructions,
      createdDate: new Date(),
      modifiedDate: new Date(),
      createdBy,
      modifiedBy: createdBy,
    };

    return shipment;
  }

  /**
   * Ship order with carrier integration
   */
  async shipOrder(
    shipmentId: string,
    shippingDetails: {
      actualShipDate?: Date;
      billOfLading?: string;
      freightBill?: string;
      carrierPickupId?: string;
      driverName?: string;
      truckNumber?: string;
    },
    shippedBy: string
  ): Promise<{
    status: 'SHIPPED' | 'ERROR';
    trackingNumbers: string[];
    billOfLading?: string;
    estimatedDelivery?: Date;
    shippingCost: number;
    errorMessage?: string;
  }> {
    const shipment = await this.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found`);
    }

    if (shipment.status !== ShipmentStatus.PLANNED && shipment.status !== ShipmentStatus.PACKED) {
      throw new Error(
        `Shipment ${shipment.shipmentNumber} cannot be shipped in status ${shipment.status}`
      );
    }

    try {
      // Integrate with carrier API for label generation
      const carrierResponse = await this.integrateWithCarrierAPI(shipment, shippingDetails);

      // Update shipment with carrier response
      const updatedShipment: Shipment = {
        ...shipment,
        status: ShipmentStatus.SHIPPED,
        actualShipDate: shippingDetails.actualShipDate || new Date(),
        trackingNumber: carrierResponse.masterTrackingNumber,
        billOfLading: shippingDetails.billOfLading,
        freightBill: shippingDetails.freightBill,
        packageDetails: shipment.packageDetails.map((pkg, index) => ({
          ...pkg,
          trackingNumber: carrierResponse.packageTrackingNumbers[index] || pkg.trackingNumber,
        })),
        modifiedDate: new Date(),
        modifiedBy: shippedBy,
      };

      // Update order status
      await this.updateOrderStatusAfterShipment(shipment.orderId);

      return {
        status: 'SHIPPED',
        trackingNumbers: carrierResponse.packageTrackingNumbers,
        billOfLading: shippingDetails.billOfLading,
        estimatedDelivery: carrierResponse.estimatedDelivery,
        shippingCost: updatedShipment.shippingCost,
      };
    } catch (error) {
      return {
        status: 'ERROR',
        trackingNumbers: [],
        shippingCost: shipment.shippingCost,
        errorMessage: error instanceof Error ? error.message : 'Unknown shipping error',
      };
    }
  }

  // ================================
  // HELPER METHODS
  // ================================

  private async validateOrderForPicking(order: SalesOrder): Promise<void> {
    if (!['BOOKED', 'CONFIRMED'].includes(order.status)) {
      throw new Error(`Order ${order.orderNumber} must be booked or confirmed for picking`);
    }

    // Check for active holds that prevent picking
    const blockingHolds = order.holds.filter(
      (hold) => hold.status === 'ACTIVE' && ['CREDIT', 'QUALITY'].includes(hold.holdType)
    );

    if (blockingHolds.length > 0) {
      throw new Error(
        `Order has active holds preventing picking: ${blockingHolds.map((h) => h.holdType).join(', ')}`
      );
    }
  }

  private async getOrderAllocations(
    orderId: string,
    warehouseId: string
  ): Promise<OrderAllocation[]> {
    // Implementation would retrieve allocations from inventory system
    return [];
  }

  private async generateOptimizedPickInstructions(
    lineItems: OrderLineItem[],
    allocations: OrderAllocation[],
    warehouseId: string,
    strategy: string
  ): Promise<PickInstruction[]> {
    // Implementation would optimize pick sequence based on warehouse layout
    return lineItems.map((item, index) => ({
      lineNumber: index + 1,
      orderLineItemId: item.id,
      itemCode: item.itemCode,
      itemDescription: item.itemDescription,
      quantityToPick: item.quantity,
      quantityPicked: 0,
      unitOfMeasure: item.unitOfMeasure,
      warehouseLocation: `A${index + 1}-01-01`,
      zone: 'A',
      aisle: `${index + 1}`,
      shelf: '01',
      bin: '01',
      pickSequence: index + 1,
      substitutionAllowed: false,
      status: 'PENDING',
    }));
  }

  private calculatePickTime(instructions: PickInstruction[], warehouseId: string): number {
    // Implementation would calculate based on warehouse metrics
    return instructions.length * 3; // 3 minutes per item average
  }

  private calculateActualPickTime(startTime: Date, endTime: Date): number {
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
  }

  private async handlePickShortages(
    pickListId: string,
    instructions: PickInstruction[]
  ): Promise<void> {
    // Implementation would create shortage records and back orders
    const shortages = instructions.filter((inst) => inst.status === 'SHORT');
    for (const shortage of shortages) {
      console.log(
        `Shortage detected: ${shortage.itemCode}, short by ${shortage.quantityToPick - shortage.quantityPicked}`
      );
    }
  }

  private async generateOptimalPackaging(
    pickInstructions: PickInstruction[],
    shippingAddress: OrderAddress,
    strategy?: any
  ): Promise<PackageDetail[]> {
    // Implementation would optimize packaging based on item characteristics
    return [
      {
        packageNumber: 'PKG-001',
        packageType: 'BOX',
        weight: 5.0,
        weightUnit: 'LBS',
        dimensions: {
          length: 12,
          width: 10,
          height: 8,
          unit: 'IN',
        },
        items: pickInstructions.map((inst) => ({
          orderLineItemId: inst.orderLineItemId,
          itemCode: inst.itemCode,
          itemDescription: inst.itemDescription,
          quantity: inst.quantityPicked,
          serialNumbers: inst.serialNumber ? [inst.serialNumber] : undefined,
          lotNumbers: inst.lotNumber ? [inst.lotNumber] : undefined,
        })),
      },
    ];
  }

  private async checkForHazardousMaterials(instructions: PickInstruction[]): Promise<boolean> {
    // Implementation would check item hazmat classifications
    return false;
  }

  private generatePackingInstructions(packageDetails: PackageDetail[]): string {
    return 'Standard packing procedures apply. Fragile items require bubble wrap.';
  }

  private async getSpecialHandlingRequirements(
    order: SalesOrder,
    instructions: PickInstruction[]
  ): Promise<string[]> {
    const requirements = [];

    if (order.priority === Priority.URGENT) {
      requirements.push('RUSH_HANDLING');
    }

    // Check for temperature-sensitive items
    // Check for fragile items
    // etc.

    return requirements;
  }

  private async generateShipmentLineItems(
    order: SalesOrder,
    packingSlip: PackingSlip
  ): Promise<ShipmentLineItem[]> {
    // Implementation would map packed items to shipment line items
    return order.lineItems.map((item) => ({
      orderLineItemId: item.id,
      itemId: item.itemId,
      itemCode: item.itemCode,
      shippedQuantity: item.quantity,
      unitOfMeasure: item.unitOfMeasure,
      condition: 'NEW',
    }));
  }

  private async calculateDeliveryEstimate(
    shippingAddress: OrderAddress,
    carrierId: string,
    shippingMethod: string
  ): Promise<Date> {
    // Implementation would integrate with carrier APIs
    const businessDays = shippingMethod.includes('EXPRESS')
      ? 1
      : shippingMethod.includes('OVERNIGHT')
        ? 1
        : shippingMethod.includes('2DAY')
          ? 2
          : 5;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + businessDays);
    return deliveryDate;
  }

  private async calculateShippingCost(
    packageDetails: PackageDetail[],
    shippingAddress: OrderAddress,
    shippingOptions: any
  ): Promise<number> {
    // Implementation would integrate with carrier rating APIs
    const totalWeight = packageDetails.reduce((sum, pkg) => sum + pkg.weight, 0);
    const baseRate = shippingOptions.shippingMethod.includes('EXPRESS') ? 25.0 : 12.5;
    return totalWeight * baseRate;
  }

  private async calculateInsuranceCost(insuredValue: number): Promise<number> {
    return insuredValue * 0.005; // 0.5% of insured value
  }

  private async integrateWithCarrierAPI(
    shipment: Shipment,
    details: any
  ): Promise<{
    masterTrackingNumber: string;
    packageTrackingNumbers: string[];
    estimatedDelivery: Date;
    labelUrls: string[];
  }> {
    // Implementation would integrate with actual carrier APIs (UPS, FedEx, etc.)
    return {
      masterTrackingNumber: `1Z999AA1234567890${Date.now().toString().slice(-3)}`,
      packageTrackingNumbers: shipment.packageDetails.map(
        (_, index) => `1Z999AA1234567890${Date.now().toString().slice(-3)}${index}`
      ),
      estimatedDelivery: shipment.estimatedDeliveryDate || new Date(),
      labelUrls: ['https://example.com/label1.pdf'],
    };
  }

  private async updateOrderStatusAfterShipment(orderId: string): Promise<void> {
    // Implementation would update order status based on shipment completion
    // Check if all line items have been shipped, update to SHIPPED or PARTIALLY_SHIPPED
  }

  // Data access methods (would be implemented with actual database access)
  private async getOrderById(orderId: string): Promise<SalesOrder | null> {
    return null;
  }

  private async getPickListById(pickListId: string): Promise<PickList | null> {
    return null;
  }

  private async getPackingSlipById(packingSlipId: string): Promise<PackingSlip | null> {
    return null;
  }

  private async getShipmentById(shipmentId: string): Promise<Shipment | null> {
    return null;
  }
}

export const orderFulfillmentService = new OrderFulfillmentService();
