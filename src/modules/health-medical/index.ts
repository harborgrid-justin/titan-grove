/**
 * Health & Medical Module
 * Healthcare management services and business logic integration
 */

import { healthMedicalDomainManager, HealthMedicalBusinessLogic } from '../../domains/health-medical';

export interface PatientRecord {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'M' | 'F' | 'O';
  ssn?: string;
  phone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  insurance?: {
    primary: string;
    secondary?: string;
    policyNumber: string;
    groupNumber?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  conditions: string[];
  allergies: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    prescribedDate: Date;
  }>;
  vitals?: {
    height: number; // cm
    weight: number; // kg
    bloodPressure: { systolic: number; diastolic: number };
    heartRate: number;
    temperature: number; // celsius
    respiratoryRate: number;
    oxygenSaturation: number;
    recordedDate: Date;
  };
  lastVisit?: Date;
  createdDate: Date;
  updatedDate: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  appointmentType: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  scheduledDate: Date;
  duration: number; // minutes
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  location: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface ClinicalOrder {
  id: string;
  patientId: string;
  providerId: string;
  orderType: 'lab' | 'imaging' | 'medication' | 'procedure' | 'referral';
  orderDetails: {
    code: string;
    description: string;
    instructions?: string;
    priority: 'routine' | 'urgent' | 'stat';
  };
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  orderDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  results?: any;
  createdDate: Date;
  updatedDate: Date;
}

export interface MedicalBill {
  id: string;
  patientId: string;
  providerId: string;
  serviceDate: Date;
  procedures: Array<{
    cptCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  diagnoses: Array<{
    icd10Code: string;
    description: string;
    primary: boolean;
  }>;
  totalCharges: number;
  insurancePayment?: number;
  patientPayment?: number;
  adjustments?: number;
  balance: number;
  status: 'pending' | 'submitted' | 'paid' | 'denied' | 'appealed';
  submissionDate?: Date;
  paymentDate?: Date;
  createdDate: Date;
  updatedDate: Date;
}

/**
 * Health Medical Manager
 * Central service for healthcare operations and patient management
 */
export class HealthMedicalManager {
  
  /**
   * Patient Management Services
   */
  async createPatient(patientData: Omit<PatientRecord, 'id' | 'createdDate' | 'updatedDate'>): Promise<PatientRecord> {
    const patient: PatientRecord = {
      id: `pt-${Date.now()}`,
      ...patientData,
      createdDate: new Date(),
      updatedDate: new Date()
    };

    // Calculate patient risk score using domain business logic
    const riskAnalysis = HealthMedicalBusinessLogic.calculatePatientRiskScore(
      {
        age: this.calculateAge(patient.dateOfBirth),
        chronicConditions: patient.conditions,
        medications: patient.medications.length,
        priorAdmissions: 0, // Would get from medical history
        labValues: {}, // Would get from lab results
        socialFactors: {
          insurance: patient.insurance?.primary === 'Medicare' ? 'medicare' : 
                    patient.insurance?.primary === 'Medicaid' ? 'medicaid' : 
                    patient.insurance ? 'commercial' : 'uninsured',
          zipCode: patient.address?.zipCode || '',
          supportSystem: patient.emergencyContact ? 'moderate' : 'weak'
        }
      },
      await healthMedicalDomainManager.config
    );

    // Store risk analysis with patient record
    console.log(`Patient ${patient.id} risk assessment:`, riskAnalysis);

    return patient;
  }

  async updatePatient(patientId: string, updates: Partial<PatientRecord>): Promise<PatientRecord> {
    // In real implementation, would update database
    const updatedPatient: PatientRecord = {
      id: patientId,
      mrn: updates.mrn || `MRN-${patientId}`,
      firstName: updates.firstName || '',
      lastName: updates.lastName || '',
      dateOfBirth: updates.dateOfBirth || new Date(),
      gender: updates.gender || 'O',
      conditions: updates.conditions || [],
      allergies: updates.allergies || [],
      medications: updates.medications || [],
      createdDate: updates.createdDate || new Date(),
      updatedDate: new Date(),
      ...updates
    };

    return updatedPatient;
  }

  async getPatient(patientId: string): Promise<PatientRecord | null> {
    // Mock implementation - would query database
    return {
      id: patientId,
      mrn: `MRN-${patientId}`,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1970-01-01'),
      gender: 'M',
      conditions: ['diabetes', 'hypertension'],
      allergies: ['penicillin'],
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'BID',
          prescribedBy: 'Dr. Smith',
          prescribedDate: new Date()
        }
      ],
      createdDate: new Date(),
      updatedDate: new Date()
    };
  }

  /**
   * Appointment Management Services
   */
  async scheduleAppointment(appointmentData: Omit<Appointment, 'id' | 'createdDate' | 'updatedDate'>): Promise<Appointment> {
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      ...appointmentData,
      createdDate: new Date(),
      updatedDate: new Date()
    };

    return appointment;
  }

  async getAppointments(patientId?: string, providerId?: string, date?: Date): Promise<Appointment[]> {
    // Mock implementation
    return [
      {
        id: 'apt-001',
        patientId: patientId || 'pt-001',
        providerId: providerId || 'pr-001',
        appointmentType: 'consultation',
        scheduledDate: date || new Date(),
        duration: 30,
        status: 'scheduled',
        reason: 'Annual checkup',
        location: 'Clinic Room 101',
        createdDate: new Date(),
        updatedDate: new Date()
      }
    ];
  }

  /**
   * Clinical Order Management
   */
  async createClinicalOrder(orderData: Omit<ClinicalOrder, 'id' | 'createdDate' | 'updatedDate'>): Promise<ClinicalOrder> {
    const order: ClinicalOrder = {
      id: `ord-${Date.now()}`,
      ...orderData,
      createdDate: new Date(),
      updatedDate: new Date()
    };

    return order;
  }

  async getClinicalOrders(patientId: string): Promise<ClinicalOrder[]> {
    // Mock implementation
    return [
      {
        id: 'ord-001',
        patientId,
        providerId: 'pr-001',
        orderType: 'lab',
        orderDetails: {
          code: 'CBC',
          description: 'Complete Blood Count',
          priority: 'routine'
        },
        status: 'pending',
        orderDate: new Date(),
        createdDate: new Date(),
        updatedDate: new Date()
      }
    ];
  }

  /**
   * Medical Billing Services
   */
  async createMedicalBill(billData: Omit<MedicalBill, 'id' | 'createdDate' | 'updatedDate'>): Promise<MedicalBill> {
    const bill: MedicalBill = {
      id: `bill-${Date.now()}`,
      ...billData,
      createdDate: new Date(),
      updatedDate: new Date()
    };

    // Calculate revenue cycle metrics using domain business logic
    const revenueCycleMetrics = HealthMedicalBusinessLogic.calculateRevenueCycleMetrics(
      [{
        id: bill.id,
        amount: bill.totalCharges,
        serviceDate: bill.serviceDate,
        submissionDate: bill.submissionDate || new Date(),
        paymentDate: bill.paymentDate,
        paymentAmount: bill.insurancePayment
      }],
      await healthMedicalDomainManager.config
    );

    console.log(`Revenue cycle metrics for bill ${bill.id}:`, revenueCycleMetrics);

    return bill;
  }

  async getMedicalBills(patientId?: string): Promise<MedicalBill[]> {
    // Mock implementation
    return [
      {
        id: 'bill-001',
        patientId: patientId || 'pt-001',
        providerId: 'pr-001',
        serviceDate: new Date(),
        procedures: [
          {
            cptCode: '99213',
            description: 'Office visit, established patient',
            quantity: 1,
            unitPrice: 150,
            totalPrice: 150
          }
        ],
        diagnoses: [
          {
            icd10Code: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            primary: true
          }
        ],
        totalCharges: 150,
        balance: 150,
        status: 'pending',
        createdDate: new Date(),
        updatedDate: new Date()
      }
    ];
  }

  /**
   * Healthcare Analytics
   */
  async getHealthcareAnalytics(): Promise<any> {
    return await healthMedicalDomainManager.optimizeHealthcareOperations();
  }

  /**
   * Clinical Decision Support
   */
  async getClinicalDecisionSupport(patientId: string): Promise<any> {
    const patient = await this.getPatient(patientId);
    if (!patient) return null;

    return HealthMedicalBusinessLogic.generateClinicalDecisionSupport(
      {
        age: this.calculateAge(patient.dateOfBirth),
        gender: patient.gender,
        conditions: patient.conditions,
        medications: patient.medications,
        allergies: patient.allergies,
        labResults: {}, // Would get from lab system
        vitalSigns: patient.vitals ? {
          systolic: patient.vitals.bloodPressure.systolic,
          diastolic: patient.vitals.bloodPressure.diastolic,
          heartRate: patient.vitals.heartRate
        } : {}
      },
      await healthMedicalDomainManager.config
    );
  }

  /**
   * Quality Metrics Calculation
   */
  async calculateQualityMetrics(): Promise<any> {
    // Mock patient population data
    const patientPopulation = [
      {
        id: 'pt-001',
        age: 65,
        conditions: ['diabetes'],
        screenings: { 
          a1c: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
        },
        medications: ['metformin'],
        admissions: 0,
        emergencyVisits: 1
      }
    ];

    return HealthMedicalBusinessLogic.calculateQualityMetrics(
      patientPopulation,
      await healthMedicalDomainManager.config
    );
  }

  /**
   * Helper Methods
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

// Singleton instance
export const healthMedicalManager = new HealthMedicalManager();