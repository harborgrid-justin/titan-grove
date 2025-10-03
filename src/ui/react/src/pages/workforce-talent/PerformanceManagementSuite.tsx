import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Loading,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  ProgressBar
} from '@carbon/react';
import {
  ChartLine,
  Trophy,
  Star,
  UserAvatar,
  Add
} from '@carbon/icons-react';
import Sidebar from '../../components/Sidebar';
import KPIWidget from '../../components/KPIWidget';

interface PerformanceReview {
  id: string;
  employee: string;
  period: string;
  score: number;
  rating: 'Exceptional' | 'Exceeds' | 'Meets' | 'Needs Improvement';
  goals: number;
  completed: number;
  status: 'Complete' | 'In Progress' | 'Pending';
}

const PerformanceManagementSuite: React.FC = () => {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviewsData();
  }, []);

  const loadReviewsData = () => {
    setTimeout(() => {
      setReviews([
        {
          id: 'rev-1',
          employee: 'John Smith',
          period: 'Q1 2024',
          score: 92,
          rating: 'Exceptional',
          goals: 5,
          completed: 5,
          status: 'Complete'
        },
        {
          id: 'rev-2',
          employee: 'Jane Doe',
          period: 'Q1 2024',
          score: 88,
          rating: 'Exceeds',
          goals: 6,
          completed: 5,
          status: 'Complete'
        },
        {
          id: 'rev-3',
          employee: 'Mike Johnson',
          period: 'Q1 2024',
          score: 75,
          rating: 'Meets',
          goals: 4,
          completed: 3,
          status: 'In Progress'
        },
        {
          id: 'rev-4',
          employee: 'Sarah Williams',
          period: 'Q1 2024',
          score: 85,
          rating: 'Exceeds',
          goals: 5,
          completed: 4,
          status: 'Complete'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Exceptional': return 'green';
      case 'Exceeds': return 'blue';
      case 'Meets': return 'yellow';
      case 'Needs Improvement': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'green';
      case 'In Progress': return 'yellow';
      case 'Pending': return 'gray';
      default: return 'gray';
    }
  };

  const kpiData = {
    totalReviews: reviews.length,
    avgScore: reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length,
    completedReviews: reviews.filter(r => r.status === 'Complete').length,
    exceptionalRatings: reviews.filter(r => r.rating === 'Exceptional').length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading description="Loading performance reviews..." withOverlay={false} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f4f4', overflowY: 'auto' }}>
        <Grid>
          <Column lg={16}>
            <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={32} />
              Performance Management Suite
            </h1>
            <p style={{ marginBottom: '2rem', color: '#525252' }}>
              Employee performance reviews and goal tracking
            </p>
          </Column>

          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Total Reviews"
              value={kpiData.totalReviews.toString()}
              trend="up"
              trendValue="10%"
              icon={<UserAvatar size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Avg Score"
              value={kpiData.avgScore.toFixed(1)}
              trend="up"
              trendValue="3%"
              icon={<Star size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Completed"
              value={kpiData.completedReviews.toString()}
              trend="up"
              trendValue="15%"
              icon={<ChartLine size={24} />}
            />
          </Column>
          <Column lg={4} md={4} sm={4}>
            <KPIWidget
              title="Exceptional"
              value={kpiData.exceptionalRatings.toString()}
              trend="up"
              trendValue="5%"
              icon={<Trophy size={24} />}
            />
          </Column>

          <Column lg={16} style={{ marginTop: '2rem' }}>
            <Tile style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Performance Reviews</h3>
                <Button kind="primary" renderIcon={Add}>
                  New Review
                </Button>
              </div>

              <DataTable rows={[]} headers={[]}>
                {() => (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Employee</TableHeader>
                          <TableHeader>Period</TableHeader>
                          <TableHeader>Score</TableHeader>
                          <TableHeader>Rating</TableHeader>
                          <TableHeader>Goals</TableHeader>
                          <TableHeader>Completed</TableHeader>
                          <TableHeader>Status</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>{review.employee}</TableCell>
                            <TableCell>{review.period}</TableCell>
                            <TableCell>
                              <div style={{ width: '80px' }}>
                                <ProgressBar value={review.score} label={review.score.toString()} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Tag type={getRatingColor(review.rating)}>
                                {review.rating}
                              </Tag>
                            </TableCell>
                            <TableCell>{review.goals}</TableCell>
                            <TableCell>{review.completed}</TableCell>
                            <TableCell>
                              <Tag type={getStatusColor(review.status)}>
                                {review.status}
                              </Tag>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            </Tile>
          </Column>
        </Grid>
      </div>
    </div>
  );
};

export default PerformanceManagementSuite;
