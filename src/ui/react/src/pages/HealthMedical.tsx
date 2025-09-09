import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Tag,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Button,
  Loading,
  InlineNotification,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  ProgressIndicator,
  ProgressStep
} from '@carbon/react';
import {
  HealthCross,
  User,
  Calendar,
  Document,
  Analytics,
  Security,
  Report,
  ChartLine,
  Settings,
  Notification,
  Add,
  View,
  ArrowRight
} from '@carbon/icons-react';
import { healthMedicalDomainManager } from '../../../../domains/health-medical';
import { 
  healthMedicalPageRegistry, 
  getHealthMedicalCategories, 
  getPagesByCategory,
  TOTAL_HEALTH_MEDICAL_PAGES 
} from './health-medical';

const HealthMedical: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('Patient Management');
  const [healthMetrics, setHealthMetrics] = useState<any>(null);

  const categories = getHealthMedicalCategories();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Load healthcare analytics from domain
        const analyticsData = await healthMedicalDomainManager.optimizeHealthcareOperations();
        setAnalytics(analyticsData);

        // Mock healthcare metrics
        setHealthMetrics({
          totalPatients: 15847,
          activeAppointments: 342,
          criticalAlerts: 7,
          complianceScore: 94.7,
          qualityScore: 91.2,
          collectionRate: 92.8,
          patientSatisfaction: 4.6,
          readmissionRate: 8.2
        });
        
      } catch (error) {
        console.error('Error loading healthcare data:', error);
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <Loading description="Loading Healthcare Management System..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Page Header */}
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              🏥 Health & Medical Management
            </h1>
            <p style={{ color: '#6f6f6f', fontSize: '1.1rem', marginBottom: '1rem' }}>
              Comprehensive healthcare operations with {TOTAL_HEALTH_MEDICAL_PAGES} business-ready pages
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Tag type="blue">HIPAA Compliant</Tag>
              <Tag type="green">Clinical Decision Support</Tag>
              <Tag type="purple">Population Health</Tag>
              <Tag type="teal">Revenue Cycle Management</Tag>
            </div>
          </div>
        </Column>
      </Grid>

      {/* Key Performance Indicators */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={4} md={2} sm={2}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center', height: '120px' }}>
            <HealthCross size={32} style={{ color: '#0f62fe', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', color: '#0f62fe' }}>
              {healthMetrics?.totalPatients?.toLocaleString() || 'N/A'}
            </h3>
            <p style={{ margin: 0, color: '#6f6f6f', fontWeight: 500 }}>Total Patients</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={2}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center', height: '120px' }}>
            <Calendar size={32} style={{ color: '#198038', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', color: '#198038' }}>
              {healthMetrics?.activeAppointments || 'N/A'}
            </h3>
            <p style={{ margin: 0, color: '#6f6f6f', fontWeight: 500 }}>Active Appointments</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={2}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center', height: '120px' }}>
            <Notification size={32} style={{ color: '#da1e28', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', color: '#da1e28' }}>
              {healthMetrics?.criticalAlerts || 'N/A'}
            </h3>
            <p style={{ margin: 0, color: '#6f6f6f', fontWeight: 500 }}>Critical Alerts</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={2}>
          <Tile style={{ padding: '1.5rem', textAlign: 'center', height: '120px' }}>
            <ChartLine size={32} style={{ color: '#8a3ffc', marginBottom: '0.5rem' }} />
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', color: '#8a3ffc' }}>
              {healthMetrics?.complianceScore ? `${healthMetrics.complianceScore}%` : 'N/A'}
            </h3>
            <p style={{ margin: 0, color: '#6f6f6f', fontWeight: 500 }}>Compliance Score</p>
          </Tile>
        </Column>
      </Grid>

      {/* Healthcare Analytics Summary */}
      {analytics && (
        <Grid style={{ marginBottom: '2rem' }}>
          <Column lg={16} md={8} sm={4}>
            <Tile style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Analytics size={24} />
                Healthcare Analytics Dashboard
              </h3>
              <Grid>
                <Column lg={3} md={2} sm={2}>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h4 style={{ color: '#0f62fe', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                      {analytics.patientRiskAnalysis?.riskScore || 'N/A'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6f6f' }}>Patient Risk Score</p>
                    <Tag type={analytics.patientRiskAnalysis?.riskLevel === 'high' ? 'red' : 'green'} size="sm">
                      {analytics.patientRiskAnalysis?.riskLevel?.toUpperCase() || 'N/A'}
                    </Tag>
                  </div>
                </Column>
                <Column lg={3} md={2} sm={2}>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h4 style={{ color: '#198038', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                      {analytics.qualityMetrics?.complianceMetrics?.preventiveScreening?.toFixed(1) || 'N/A'}%
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6f6f' }}>Quality Score</p>
                    <Tag type="green" size="sm">HEDIS COMPLIANT</Tag>
                  </div>
                </Column>
                <Column lg={3} md={2} sm={2}>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h4 style={{ color: '#8a3ffc', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                      {analytics.revenueCycleAnalysis?.financialMetrics?.collectionRate?.toFixed(1) || 'N/A'}%
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6f6f' }}>Collection Rate</p>
                    <Tag type="purple" size="sm">REVENUE CYCLE</Tag>
                  </div>
                </Column>
                <Column lg={3} md={2} sm={2}>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <h4 style={{ color: '#da1e28', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                      {analytics.clinicalDecisionSupport?.alerts?.length || 0}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6f6f6f' }}>Clinical Alerts</p>
                    <Tag type="red" size="sm">DECISION SUPPORT</Tag>
                  </div>
                </Column>
              </Grid>
            </Tile>
          </Column>
        </Grid>
      )}

      {/* Healthcare Page Categories */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={16} md={8} sm={4}>
          <Tile style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Document size={24} />
              Healthcare Modules ({TOTAL_HEALTH_MEDICAL_PAGES} Pages)
            </h3>
            
            <Tabs selectedIndex={categories.indexOf(selectedCategory)}>
              <TabList>
                {categories.map((category, index) => (
                  <Tab key={category} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {categories.map((category) => (
                  <TabPanel key={category}>
                    <Grid style={{ marginTop: '1rem' }}>
                      {getPagesByCategory(category).map((page) => (
                        <Column lg={4} md={2} sm={2} key={page.route} style={{ marginBottom: '1rem' }}>
                          <ClickableTile
                            href={`/health-medical/${page.route}`}
                            style={{ 
                              height: '120px', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              justifyContent: 'center',
                              textAlign: 'center',
                              padding: '1rem'
                            }}
                          >
                            <div style={{ marginBottom: '0.5rem' }}>
                              {category === 'Patient Management' && <User size={24} style={{ color: '#0f62fe' }} />}
                              {category === 'Clinical Operations' && <HealthCross size={24} style={{ color: '#198038' }} />}
                              {category === 'Medical Records' && <Document size={24} style={{ color: '#8a3ffc' }} />}
                              {category === 'Healthcare Analytics' && <Analytics size={24} style={{ color: '#da1e28' }} />}
                              {category === 'Regulatory Compliance' && <Security size={24} style={{ color: '#f1c21b' }} />}
                              {category === 'Clinical Decision Support' && <Settings size={24} style={{ color: '#6f6f6f' }} />}
                              {category === 'Revenue Cycle' && <ChartLine size={24} style={{ color: '#570408' }} />}
                              {category === 'Care Coordination' && <Report size={24} style={{ color: '#1192e8' }} />}
                            </div>
                            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{page.title}</h5>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>Open</span>
                              <ArrowRight size={16} style={{ color: '#6f6f6f' }} />
                            </div>
                          </ClickableTile>
                        </Column>
                      ))}
                    </Grid>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Tile>
        </Column>
      </Grid>

      {/* Recent Activity */}
      <Grid>
        <Column lg={8} md={4} sm={4}>
          <Tile style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Recent Healthcare Activity</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f4f4f4', borderRadius: '4px' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>Patient Registration - Smith, John</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6f6f6f' }}>New patient enrolled in system</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>2 min ago</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f4f4f4', borderRadius: '4px' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>Lab Results - Critical Value Alert</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6f6f6f' }}>Potassium level requires immediate attention</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>5 min ago</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f4f4f4', borderRadius: '4px' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>Quality Metrics Updated</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6f6f6f' }}>Monthly HEDIS measures calculated</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>15 min ago</span>
              </div>
            </div>
          </Tile>
        </Column>
        <Column lg={8} md={4} sm={4}>
          <Tile style={{ padding: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Healthcare System Status</h4>
            <ProgressIndicator currentIndex={2}>
              <ProgressStep
                label="HIPAA Compliance"
                description="Security measures active"
                complete
              />
              <ProgressStep
                label="Clinical Workflows"
                description="All systems operational"
                complete
              />
              <ProgressStep
                label="Revenue Cycle"
                description="Processing claims efficiently"
                current
              />
              <ProgressStep
                label="Quality Measures"
                description="Monitoring patient outcomes"
              />
            </ProgressIndicator>
            <div style={{ marginTop: '1.5rem' }}>
              <InlineNotification
                kind="success"
                title="System Status: Optimal"
                subtitle="All healthcare modules are functioning normally"
                hideCloseButton
              />
            </div>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
};

export default HealthMedical;