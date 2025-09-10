use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Employee {
    pub employee_id: String,
    pub name: String,
    pub position: String,
    pub department: String,
    pub hire_date: String,
    pub salary: f64,
    pub currency: String,
    pub employment_type: String,
    pub performance_rating: f64,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct PayrollCalculation {
    pub employee_id: String,
    pub base_salary: f64,
    pub overtime_hours: f64,
    pub overtime_rate: f64,
    pub overtime_pay: f64,
    pub gross_pay: f64,
    pub tax_deductions: f64,
    pub benefit_deductions: f64,
    pub net_pay: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct PerformanceMetrics {
    pub employee_id: String,
    pub goals_completed: i32,
    pub total_goals: i32,
    pub quality_score: f64,
    pub productivity_score: f64,
    pub teamwork_score: f64,
    pub overall_performance_score: f64,
    pub performance_level: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct BenefitCalculation {
    pub employee_id: String,
    pub health_insurance: f64,
    pub dental_insurance: f64,
    pub retirement_contribution: f64,
    pub life_insurance: f64,
    pub total_benefits_value: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct WorkforceAnalytics {
    pub total_employees: i32,
    pub average_salary: f64,
    pub turnover_rate: f64,
    pub average_performance_score: f64,
    pub department_headcount: Vec<DepartmentHeadcount>,
    pub total_payroll_cost: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct DepartmentHeadcount {
    pub department: String,
    pub employee_count: i32,
    pub average_salary: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct TimeTracking {
    pub employee_id: String,
    pub regular_hours: f64,
    pub overtime_hours: f64,
    pub vacation_hours: f64,
    pub sick_hours: f64,
    pub total_hours: f64,
}

#[napi]
pub fn calculate_payroll(
    base_salary: f64,
    overtime_hours: f64,
    overtime_multiplier: f64,
    tax_rate: f64,
    benefit_deductions: f64,
    pay_periods_per_year: f64,
) -> PayrollCalculation {
    let period_base_salary = base_salary / pay_periods_per_year;
    let hourly_rate = base_salary / (pay_periods_per_year * 40.0); // Assuming 40 hours/week
    let overtime_rate = hourly_rate * overtime_multiplier;
    let overtime_pay = overtime_hours * overtime_rate;
    let gross_pay = period_base_salary + overtime_pay;
    let tax_deductions = gross_pay * (tax_rate / 100.0);
    let net_pay = gross_pay - tax_deductions - benefit_deductions;
    
    PayrollCalculation {
        employee_id: "".to_string(), // To be set by caller
        base_salary: period_base_salary,
        overtime_hours,
        overtime_rate,
        overtime_pay,
        gross_pay,
        tax_deductions,
        benefit_deductions,
        net_pay,
    }
}

#[napi]
pub fn calculate_performance_score(
    goals_completed: i32,
    total_goals: i32,
    quality_score: f64,
    productivity_score: f64,
    teamwork_score: f64,
) -> PerformanceMetrics {
    let goal_completion_rate = if total_goals > 0 {
        (goals_completed as f64 / total_goals as f64) * 100.0
    } else {
        0.0
    };
    
    // Weighted average of performance components
    let overall_performance_score = (goal_completion_rate * 0.3) +
                                  (quality_score * 0.3) +
                                  (productivity_score * 0.25) +
                                  (teamwork_score * 0.15);
    
    let performance_level = match overall_performance_score {
        s if s >= 90.0 => "EXCEPTIONAL",
        s if s >= 80.0 => "EXCEEDS_EXPECTATIONS",
        s if s >= 70.0 => "MEETS_EXPECTATIONS",
        s if s >= 60.0 => "BELOW_EXPECTATIONS",
        _ => "UNSATISFACTORY",
    };
    
    PerformanceMetrics {
        employee_id: "".to_string(), // To be set by caller
        goals_completed,
        total_goals,
        quality_score,
        productivity_score,
        teamwork_score,
        overall_performance_score,
        performance_level: performance_level.to_string(),
    }
}

#[napi]
pub fn calculate_benefits_value(
    salary: f64,
    health_insurance_percentage: f64,
    dental_insurance_percentage: f64,
    retirement_match_percentage: f64,
    life_insurance_flat_rate: f64,
) -> BenefitCalculation {
    let health_insurance = salary * (health_insurance_percentage / 100.0);
    let dental_insurance = salary * (dental_insurance_percentage / 100.0);
    let retirement_contribution = salary * (retirement_match_percentage / 100.0);
    let life_insurance = life_insurance_flat_rate;
    let total_benefits_value = health_insurance + dental_insurance + retirement_contribution + life_insurance;
    
    BenefitCalculation {
        employee_id: "".to_string(), // To be set by caller
        health_insurance,
        dental_insurance,
        retirement_contribution,
        life_insurance,
        total_benefits_value,
    }
}

#[napi]
pub fn calculate_turnover_rate(
    employees_left: i32,
    average_headcount: i32,
    period_months: i32,
) -> f64 {
    if average_headcount == 0 {
        return 0.0;
    }
    
    // Annualized turnover rate
    let annual_turnover = (employees_left as f64 / average_headcount as f64) * 
                         (12.0 / period_months as f64) * 100.0;
    annual_turnover
}

#[napi]
pub fn calculate_salary_increase_recommendation(
    current_salary: f64,
    performance_score: f64,
    market_adjustment: f64,
    budget_constraint: f64,
) -> f64 {
    // Base increase based on performance
    let performance_increase = match performance_score {
        s if s >= 90.0 => 8.0, // 8% for exceptional performance
        s if s >= 80.0 => 5.0, // 5% for exceeds expectations
        s if s >= 70.0 => 3.0, // 3% for meets expectations
        s if s >= 60.0 => 1.0, // 1% for below expectations
        _ => 0.0, // No increase for unsatisfactory
    };
    
    // Combined increase (performance + market adjustment)
    let total_increase_percentage = performance_increase + market_adjustment;
    
    // Apply budget constraint
    let constrained_increase = total_increase_percentage.min(budget_constraint);
    
    current_salary * (constrained_increase / 100.0)
}

#[napi]
pub fn calculate_cost_per_hire(
    total_recruiting_cost: f64,
    number_of_hires: i32,
) -> f64 {
    if number_of_hires > 0 {
        total_recruiting_cost / number_of_hires as f64
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_employee_productivity(
    revenue_generated: f64,
    hours_worked: f64,
) -> f64 {
    if hours_worked > 0.0 {
        revenue_generated / hours_worked
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_training_roi(
    training_cost: f64,
    productivity_improvement: f64,
    employee_salary: f64,
    training_period_months: i32,
) -> f64 {
    let monthly_salary = employee_salary / 12.0;
    let productivity_value = monthly_salary * (productivity_improvement / 100.0) * training_period_months as f64;
    
    if training_cost > 0.0 {
        ((productivity_value - training_cost) / training_cost) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_compensation_ratio(
    employee_salary: f64,
    market_median_salary: f64,
) -> f64 {
    if market_median_salary > 0.0 {
        (employee_salary / market_median_salary) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn generate_workforce_analytics(
    employees: Vec<Employee>,
    turnover_count: i32,
    period_months: i32,
) -> WorkforceAnalytics {
    let total_employees = employees.len() as i32;
    
    let total_salary: f64 = employees.iter().map(|e| e.salary).sum();
    let average_salary = if total_employees > 0 {
        total_salary / total_employees as f64
    } else {
        0.0
    };
    
    let turnover_rate = calculate_turnover_rate(turnover_count, total_employees, period_months);
    
    let average_performance_score: f64 = employees.iter()
        .map(|e| e.performance_rating)
        .sum::<f64>() / employees.len().max(1) as f64;
    
    // Group by department
    let mut department_stats: std::collections::HashMap<String, (i32, f64)> = std::collections::HashMap::new();
    for employee in &employees {
        let entry = department_stats.entry(employee.department.clone()).or_insert((0, 0.0));
        entry.0 += 1; // count
        entry.1 += employee.salary; // total salary
    }
    
    let department_headcount: Vec<DepartmentHeadcount> = department_stats
        .into_iter()
        .map(|(dept, (count, total_sal))| DepartmentHeadcount {
            department: dept,
            employee_count: count,
            average_salary: if count > 0 { total_sal / count as f64 } else { 0.0 },
        })
        .collect();
    
    WorkforceAnalytics {
        total_employees,
        average_salary,
        turnover_rate,
        average_performance_score,
        department_headcount,
        total_payroll_cost: total_salary,
    }
}

#[napi]
pub fn calculate_overtime_threshold(
    regular_hours_per_week: f64,
    overtime_multiplier: f64,
    target_cost_increase: f64,
) -> f64 {
    // Calculate at what point overtime becomes cost-prohibitive
    let cost_per_regular_hour = 1.0; // Baseline
    let cost_per_overtime_hour = overtime_multiplier;
    
    let additional_cost_ratio = cost_per_overtime_hour - cost_per_regular_hour;
    let threshold_hours = regular_hours_per_week * (1.0 + target_cost_increase / 100.0);
    
    threshold_hours
}