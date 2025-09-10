use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct Property {
    pub property_id: String,
    pub property_type: String,
    pub location: String,
    pub square_footage: f64,
    pub bedrooms: i32,
    pub bathrooms: i32,
    pub year_built: i32,
    pub current_value: f64,
    pub monthly_rent: f64,
    pub occupancy_status: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[napi(object)]
pub struct LeaseContract {
    pub lease_id: String,
    pub property_id: String,
    pub tenant_id: String,
    pub start_date: String,
    pub end_date: String,
    pub monthly_rent: f64,
    pub security_deposit: f64,
    pub lease_type: String,
    pub renewal_terms: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct PropertyValuation {
    pub property_id: String,
    pub estimated_value: f64,
    pub comparable_sales_value: f64,
    pub income_approach_value: f64,
    pub cost_approach_value: f64,
    pub confidence_level: f64,
    pub valuation_date: String,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct RentalYieldAnalysis {
    pub property_id: String,
    pub annual_rental_income: f64,
    pub property_value: f64,
    pub gross_yield: f64,
    pub net_yield: f64,
    pub operating_expenses: f64,
    pub roi_percentage: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct MarketAnalysis {
    pub area: String,
    pub average_property_value: f64,
    pub average_rent_per_sqft: f64,
    pub vacancy_rate: f64,
    pub market_trend: String,
    pub price_appreciation: f64,
    pub rental_demand_score: f64,
}

#[derive(Serialize, Deserialize)]
#[napi(object)]
pub struct PropertyMetrics {
    pub total_properties: i32,
    pub occupied_properties: i32,
    pub occupancy_rate: f64,
    pub total_rental_income: f64,
    pub average_rent_per_sqft: f64,
    pub total_property_value: f64,
    pub portfolio_yield: f64,
}

#[napi]
pub fn calculate_property_value_comparative(
    comparable_sales: Vec<f64>,
    property_sqft: f64,
    comparable_sqft: Vec<f64>,
    location_adjustment: f64,
    condition_adjustment: f64,
) -> f64 {
    if comparable_sales.is_empty() || comparable_sqft.is_empty() {
        return 0.0;
    }
    
    // Calculate price per square foot for comparables
    let mut price_per_sqft_values = Vec::new();
    for i in 0..comparable_sales.len().min(comparable_sqft.len()) {
        if comparable_sqft[i] > 0.0 {
            price_per_sqft_values.push(comparable_sales[i] / comparable_sqft[i]);
        }
    }
    
    if price_per_sqft_values.is_empty() {
        return 0.0;
    }
    
    // Calculate average price per square foot
    let avg_price_per_sqft = price_per_sqft_values.iter().sum::<f64>() / price_per_sqft_values.len() as f64;
    
    // Apply adjustments
    let adjusted_price_per_sqft = avg_price_per_sqft * location_adjustment * condition_adjustment;
    
    property_sqft * adjusted_price_per_sqft
}

#[napi]
pub fn calculate_rental_yield(
    annual_rental_income: f64,
    property_value: f64,
    annual_operating_expenses: f64,
) -> RentalYieldAnalysis {
    let gross_yield = if property_value > 0.0 {
        (annual_rental_income / property_value) * 100.0
    } else {
        0.0
    };
    
    let net_rental_income = annual_rental_income - annual_operating_expenses;
    let net_yield = if property_value > 0.0 {
        (net_rental_income / property_value) * 100.0
    } else {
        0.0
    };
    
    let roi_percentage = net_yield; // ROI is equivalent to net yield for rental properties
    
    RentalYieldAnalysis {
        property_id: "".to_string(), // To be set by caller
        annual_rental_income,
        property_value,
        gross_yield,
        net_yield,
        operating_expenses: annual_operating_expenses,
        roi_percentage,
    }
}

#[napi]
pub fn calculate_optimal_rent(
    market_rent_per_sqft: f64,
    property_sqft: f64,
    property_condition_factor: f64,
    location_premium: f64,
    amenities_premium: f64,
) -> f64 {
    let base_rent = market_rent_per_sqft * property_sqft;
    let adjusted_rent = base_rent * property_condition_factor * (1.0 + location_premium) * (1.0 + amenities_premium);
    adjusted_rent
}

#[napi]
pub fn calculate_lease_break_penalty(
    remaining_lease_months: i32,
    monthly_rent: f64,
    penalty_percentage: f64,
) -> f64 {
    let remaining_rent = remaining_lease_months as f64 * monthly_rent;
    remaining_rent * (penalty_percentage / 100.0)
}

#[napi]
pub fn calculate_property_appreciation(
    current_value: f64,
    purchase_value: f64,
    years_held: f64,
) -> f64 {
    if purchase_value > 0.0 && years_held > 0.0 {
        let total_appreciation = ((current_value - purchase_value) / purchase_value) * 100.0;
        total_appreciation / years_held // Annual appreciation rate
    } else {
        0.0
    }
}

#[napi]
pub fn optimize_space_allocation(
    total_space_sqft: f64,
    space_requirements: Vec<f64>,
    space_priorities: Vec<i32>,
    cost_per_sqft: f64,
) -> Vec<f64> {
    if space_requirements.is_empty() || space_priorities.is_empty() {
        return Vec::new();
    }
    
    // Create requirement-priority pairs and sort by priority
    let mut req_priority_pairs: Vec<_> = space_requirements.into_iter()
        .zip(space_priorities.into_iter())
        .collect();
    req_priority_pairs.sort_by(|a, b| b.1.cmp(&a.1));
    
    let mut allocated_space = Vec::new();
    let mut remaining_space = total_space_sqft;
    
    for (requirement, _priority) in req_priority_pairs {
        let allocation = if remaining_space >= requirement {
            remaining_space -= requirement;
            requirement
        } else {
            let partial_allocation = remaining_space;
            remaining_space = 0.0;
            partial_allocation
        };
        allocated_space.push(allocation);
    }
    
    allocated_space
}

#[napi]
pub fn calculate_property_cash_flow(
    monthly_rent: f64,
    mortgage_payment: f64,
    property_taxes: f64,
    insurance: f64,
    maintenance_costs: f64,
    property_management_fee: f64,
) -> f64 {
    let monthly_expenses = mortgage_payment + property_taxes + insurance + maintenance_costs + property_management_fee;
    monthly_rent - monthly_expenses
}

#[napi]
pub fn calculate_capitalization_rate(
    net_operating_income: f64,
    property_value: f64,
) -> f64 {
    if property_value > 0.0 {
        (net_operating_income / property_value) * 100.0
    } else {
        0.0
    }
}

#[napi]
pub fn calculate_debt_service_coverage_ratio(
    net_operating_income: f64,
    annual_debt_service: f64,
) -> f64 {
    if annual_debt_service > 0.0 {
        net_operating_income / annual_debt_service
    } else {
        0.0
    }
}

#[napi]
pub fn assess_investment_viability(
    purchase_price: f64,
    annual_rental_income: f64,
    annual_expenses: f64,
    financing_costs: f64,
    target_roi: f64,
) -> f64 {
    let net_income = annual_rental_income - annual_expenses - financing_costs;
    let actual_roi = if purchase_price > 0.0 {
        (net_income / purchase_price) * 100.0
    } else {
        0.0
    };
    
    // Viability score: how much actual ROI exceeds target ROI
    actual_roi - target_roi
}

#[napi]
pub fn calculate_vacancy_impact(
    annual_rental_income: f64,
    vacancy_rate: f64,
    vacancy_preparation_cost: f64,
) -> f64 {
    let income_loss = annual_rental_income * (vacancy_rate / 100.0);
    let total_vacancy_cost = income_loss + vacancy_preparation_cost;
    total_vacancy_cost
}

#[napi]
pub fn optimize_maintenance_schedule(
    properties: Vec<Property>,
    maintenance_budget: f64,
    urgency_scores: Vec<f64>,
) -> Vec<String> {
    if properties.is_empty() || urgency_scores.is_empty() {
        return Vec::new();
    }
    
    // Create property-urgency pairs and sort by urgency
    let mut property_urgency_pairs: Vec<_> = properties.into_iter()
        .zip(urgency_scores.into_iter())
        .collect();
    property_urgency_pairs.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    
    let mut maintenance_schedule = Vec::new();
    let mut remaining_budget = maintenance_budget;
    
    // Estimate maintenance cost as percentage of property value
    for (property, _urgency) in property_urgency_pairs {
        let estimated_cost = property.current_value * 0.02; // 2% of property value
        
        if remaining_budget >= estimated_cost {
            maintenance_schedule.push(property.property_id);
            remaining_budget -= estimated_cost;
        }
    }
    
    maintenance_schedule
}

#[napi]
pub fn generate_property_metrics(
    properties: Vec<Property>,
) -> PropertyMetrics {
    let total_properties = properties.len() as i32;
    
    let occupied_properties = properties.iter()
        .filter(|p| p.occupancy_status == "OCCUPIED")
        .count() as i32;
    
    let occupancy_rate = if total_properties > 0 {
        (occupied_properties as f64 / total_properties as f64) * 100.0
    } else {
        0.0
    };
    
    let total_rental_income: f64 = properties.iter()
        .filter(|p| p.occupancy_status == "OCCUPIED")
        .map(|p| p.monthly_rent)
        .sum();
    
    let total_sqft: f64 = properties.iter().map(|p| p.square_footage).sum();
    let average_rent_per_sqft = if total_sqft > 0.0 {
        total_rental_income / total_sqft
    } else {
        0.0
    };
    
    let total_property_value: f64 = properties.iter().map(|p| p.current_value).sum();
    
    let annual_rental_income = total_rental_income * 12.0;
    let portfolio_yield = if total_property_value > 0.0 {
        (annual_rental_income / total_property_value) * 100.0
    } else {
        0.0
    };
    
    PropertyMetrics {
        total_properties,
        occupied_properties,
        occupancy_rate,
        total_rental_income,
        average_rent_per_sqft,
        total_property_value,
        portfolio_yield,
    }
}

#[napi]
pub fn calculate_market_rent_estimate(
    comparable_rents: Vec<f64>,
    comparable_sqft: Vec<f64>,
    property_sqft: f64,
    location_adjustment: f64,
) -> f64 {
    if comparable_rents.is_empty() || comparable_sqft.is_empty() {
        return 0.0;
    }
    
    // Calculate rent per square foot for comparables
    let mut rent_per_sqft_values = Vec::new();
    for i in 0..comparable_rents.len().min(comparable_sqft.len()) {
        if comparable_sqft[i] > 0.0 {
            rent_per_sqft_values.push(comparable_rents[i] / comparable_sqft[i]);
        }
    }
    
    if rent_per_sqft_values.is_empty() {
        return 0.0;
    }
    
    let avg_rent_per_sqft = rent_per_sqft_values.iter().sum::<f64>() / rent_per_sqft_values.len() as f64;
    let adjusted_rent_per_sqft = avg_rent_per_sqft * location_adjustment;
    
    property_sqft * adjusted_rent_per_sqft
}