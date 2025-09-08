/**
 * Logistics API Routes
 * Backend API endpoints for all logistics management pages
 */

import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validation';
import { logisticsController } from './logistics-controller';

const router = Router();

// Apply authentication middleware to all logistics routes
router.use(authenticate);

// Transportation Management Routes
router.get('/transportation/transportation-planning', logisticsController.getTransportationPlanning);
router.post('/transportation/transportation-planning', validateRequest, logisticsController.createTransportationPlan);
router.put('/transportation/transportation-planning/:id', validateRequest, logisticsController.updateTransportationPlan);
router.delete('/transportation/transportation-planning/:id', logisticsController.deleteTransportationPlan);

router.get('/transportation/carrier-management', logisticsController.getCarrierManagement);
router.post('/transportation/carrier-management', validateRequest, logisticsController.createCarrier);
router.put('/transportation/carrier-management/:id', validateRequest, logisticsController.updateCarrier);
router.delete('/transportation/carrier-management/:id', logisticsController.deleteCarrier);

router.get('/transportation/shipment-execution', logisticsController.getShipmentExecution);
router.post('/transportation/shipment-execution', validateRequest, logisticsController.createShipment);
router.put('/transportation/shipment-execution/:id', validateRequest, logisticsController.updateShipment);
router.delete('/transportation/shipment-execution/:id', logisticsController.deleteShipment);

router.get('/transportation/bid-management', logisticsController.getBidManagement);
router.post('/transportation/bid-management', validateRequest, logisticsController.createBid);
router.put('/transportation/bid-management/:id', validateRequest, logisticsController.updateBid);
router.delete('/transportation/bid-management/:id', logisticsController.deleteBid);

router.get('/transportation/fleet-management', logisticsController.getFleetManagement);
router.post('/transportation/fleet-management', validateRequest, logisticsController.createFleetVehicle);
router.put('/transportation/fleet-management/:id', validateRequest, logisticsController.updateFleetVehicle);
router.delete('/transportation/fleet-management/:id', logisticsController.deleteFleetVehicle);

router.get('/transportation/transportation-analytics', logisticsController.getTransportationAnalytics);

// Warehouse Management Routes
router.get('/warehouse/warehouse-operations', logisticsController.getWarehouseOperations);
router.post('/warehouse/warehouse-operations', validateRequest, logisticsController.createWarehouseOperation);
router.put('/warehouse/warehouse-operations/:id', validateRequest, logisticsController.updateWarehouseOperation);
router.delete('/warehouse/warehouse-operations/:id', logisticsController.deleteWarehouseOperation);

router.get('/warehouse/inventory-management', logisticsController.getInventoryManagement);
router.post('/warehouse/inventory-management', validateRequest, logisticsController.createInventoryItem);
router.put('/warehouse/inventory-management/:id', validateRequest, logisticsController.updateInventoryItem);
router.delete('/warehouse/inventory-management/:id', logisticsController.deleteInventoryItem);

router.get('/warehouse/slotting-optimization', logisticsController.getSlottingOptimization);
router.post('/warehouse/slotting-optimization', validateRequest, logisticsController.optimizeSlotting);

router.get('/warehouse/labor-management', logisticsController.getLaborManagement);
router.post('/warehouse/labor-management', validateRequest, logisticsController.createLaborRecord);
router.put('/warehouse/labor-management/:id', validateRequest, logisticsController.updateLaborRecord);
router.delete('/warehouse/labor-management/:id', logisticsController.deleteLaborRecord);

router.get('/warehouse/warehouse-automation', logisticsController.getWarehouseAutomation);
router.post('/warehouse/warehouse-automation', validateRequest, logisticsController.createAutomationRule);
router.put('/warehouse/warehouse-automation/:id', validateRequest, logisticsController.updateAutomationRule);
router.delete('/warehouse/warehouse-automation/:id', logisticsController.deleteAutomationRule);

router.get('/warehouse/warehouse-analytics', logisticsController.getWarehouseAnalytics);

// Route Optimization Routes
router.get('/routing/route-optimization', logisticsController.getRouteOptimization);
router.post('/routing/route-optimization', validateRequest, logisticsController.optimizeRoute);

router.get('/routing/delivery-planning', logisticsController.getDeliveryPlanning);
router.post('/routing/delivery-planning', validateRequest, logisticsController.createDeliveryPlan);
router.put('/routing/delivery-planning/:id', validateRequest, logisticsController.updateDeliveryPlan);
router.delete('/routing/delivery-planning/:id', logisticsController.deleteDeliveryPlan);

router.get('/routing/load-optimization', logisticsController.getLoadOptimization);
router.post('/routing/load-optimization', validateRequest, logisticsController.optimizeLoad);

router.get('/routing/dynamic-routing', logisticsController.getDynamicRouting);
router.post('/routing/dynamic-routing', validateRequest, logisticsController.updateDynamicRoute);

router.get('/routing/routing-analytics', logisticsController.getRoutingAnalytics);

// Distribution Management Routes
router.get('/distribution/network-design', logisticsController.getNetworkDesign);
router.post('/distribution/network-design', validateRequest, logisticsController.createNetworkDesign);
router.put('/distribution/network-design/:id', validateRequest, logisticsController.updateNetworkDesign);
router.delete('/distribution/network-design/:id', logisticsController.deleteNetworkDesign);

router.get('/distribution/fulfillment-strategy', logisticsController.getFulfillmentStrategy);
router.post('/distribution/fulfillment-strategy', validateRequest, logisticsController.createFulfillmentStrategy);
router.put('/distribution/fulfillment-strategy/:id', validateRequest, logisticsController.updateFulfillmentStrategy);
router.delete('/distribution/fulfillment-strategy/:id', logisticsController.deleteFulfillmentStrategy);

router.get('/distribution/supply-chain-visibility', logisticsController.getSupplyChainVisibility);

router.get('/distribution/distribution-optimization', logisticsController.getDistributionOptimization);
router.post('/distribution/distribution-optimization', validateRequest, logisticsController.optimizeDistribution);

router.get('/distribution/demand-planning', logisticsController.getDemandPlanning);
router.post('/distribution/demand-planning', validateRequest, logisticsController.createDemandPlan);
router.put('/distribution/demand-planning/:id', validateRequest, logisticsController.updateDemandPlan);
router.delete('/distribution/demand-planning/:id', logisticsController.deleteDemandPlan);

// Freight Management Routes
router.get('/freight/freight-management', logisticsController.getFreightManagement);
router.post('/freight/freight-management', validateRequest, logisticsController.createFreightRecord);
router.put('/freight/freight-management/:id', validateRequest, logisticsController.updateFreightRecord);
router.delete('/freight/freight-management/:id', logisticsController.deleteFreightRecord);

router.get('/freight/rate-optimization', logisticsController.getRateOptimization);
router.post('/freight/rate-optimization', validateRequest, logisticsController.optimizeRates);

router.get('/freight/freight-audit', logisticsController.getFreightAudit);
router.post('/freight/freight-audit', validateRequest, logisticsController.createAuditRecord);
router.put('/freight/freight-audit/:id', validateRequest, logisticsController.updateAuditRecord);
router.delete('/freight/freight-audit/:id', logisticsController.deleteAuditRecord);

router.get('/freight/contract-management', logisticsController.getContractManagement);
router.post('/freight/contract-management', validateRequest, logisticsController.createContract);
router.put('/freight/contract-management/:id', validateRequest, logisticsController.updateContract);
router.delete('/freight/contract-management/:id', logisticsController.deleteContract);

router.get('/freight/freight-analytics', logisticsController.getFreightAnalytics);

// Analytics Routes
router.get('/analytics/logistics-kpis', logisticsController.getLogisticsKPIs);

router.get('/analytics/predictive-analytics', logisticsController.getPredictiveAnalytics);

router.get('/analytics/cost-analytics', logisticsController.getCostAnalytics);

router.get('/analytics/performance-optimization', logisticsController.getPerformanceOptimization);

router.get('/analytics/business-intelligence', logisticsController.getBusinessIntelligence);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'logistics-api',
        version: '1.0.0'
    });
});

export { router as logisticsRoutes };