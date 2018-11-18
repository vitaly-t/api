update cases set general_issues = array_remove(general_issues, 'other');
update cases set general_issues = array_replace(general_issues, 'agriculture_forestry_fishing_mining_industries', 'agriculture');
update cases set general_issues = array_replace(general_issues, 'arts_culture_recreation', 'arts');
update cases set general_issues = array_replace(general_issues, 'governance_political_institutions_eg_constitutions_legal_systems_electoral_systems', 'governance');
update cases set general_issues = array_replace(general_issues, 'human_rights_civil_rights', 'human');
update cases set general_issues = array_replace(general_issues, 'identity_diversity', 'identity');
update cases set general_issues = array_replace(general_issues, 'immigration_migration', 'immigration');
update cases set general_issues = array_replace(general_issues, 'international_affairs', 'international');
update cases set general_issues = array_replace(general_issues, 'labor_work', 'labor');
update cases set general_issues = array_replace(general_issues, 'law_enforcement_criminal_justice_corrections', 'law');
update cases set general_issues = array_replace(general_issues, 'media_telecommunications_information', 'media');
update cases set general_issues = array_replace(general_issues, 'national_security', 'national');
update cases set general_issues = array_replace(general_issues, 'planning_development', 'planning');
update cases set general_issues = array_replace(general_issues, 'science_technology', 'science');
update cases set general_issues = array_replace(general_issues, 'social_welfare', 'social');

update cases set specific_topics = array_replace(specific_topics, 'ability/disability_issues', 'abilitydisability');
update cases set specific_topics = array_replace(specific_topics, 'access_to_radio_television_frequencies', 'access');
update cases set specific_topics = array_replace(specific_topics, 'administration_of_campaigns_and_elections', 'administration');
update cases set specific_topics = array_replace(specific_topics, 'affordable_housing', 'affordable');
update cases set specific_topics = array_replace(specific_topics, 'agricultural_biotechnology', 'agricultural');
update cases set specific_topics = array_replace(specific_topics, 'air_quality', 'air');
update cases set specific_topics = array_replace(specific_topics, 'alternative_renewable_energy', 'alternative');
update cases set specific_topics = array_replace(specific_topics, 'animal_welfare', 'animal');
update cases set specific_topics = array_replace(specific_topics, 'biomedical_research_development', 'biomedical');
update cases set specific_topics = array_replace(specific_topics, 'budget_local', 'budget');
update cases set specific_topics = array_replace(specific_topics, 'budget_provincial_regional_state', 'budget_provincial');
update cases set specific_topics = array_replace(specific_topics, 'child_care', 'child');
update cases set specific_topics = array_replace(specific_topics, 'citizenship_role_of_citizens', 'citizenship');
update cases set specific_topics = array_replace(specific_topics, 'civil_law', 'civil');
update cases set specific_topics = array_replace(specific_topics, 'climate_change', 'climate');
update cases set specific_topics = array_replace(specific_topics, 'community_police_relations', 'community');
update cases set specific_topics = array_replace(specific_topics, 'constitutional_reform', 'constitutional');
update cases set specific_topics = array_replace(specific_topics, 'court_systems', 'court');
update cases set specific_topics = array_replace(specific_topics, 'cultural_assimilation_or_integration', 'cultural');
update cases set specific_topics = array_replace(specific_topics, 'curriculum_and_standards', 'curriculum');
update cases set specific_topics = array_replace(specific_topics, 'cyber_security', 'cyber');
update cases set specific_topics = array_replace(specific_topics, 'disability_rights', 'disability');
update cases set specific_topics = array_replace(specific_topics, 'disaster_preparedness', 'disaster');
update cases set specific_topics = array_replace(specific_topics, 'drug_testing_regulation', 'drug');
update cases set specific_topics = array_replace(specific_topics, 'early_childhood_education', 'early');
update cases set specific_topics = array_replace(specific_topics, 'economic_development', 'economic');
update cases set specific_topics = array_replace(specific_topics, 'elderly_assistance', 'elderly');
update cases set specific_topics = array_replace(specific_topics, 'elementary_and_secondary_education', 'elementary');
update cases set specific_topics = array_replace(specific_topics, 'energy_conservation', 'energy');
update cases set specific_topics = array_replace(specific_topics, 'energy_efficiency_storage', 'energy_efficiency');
update cases set specific_topics = array_replace(specific_topics, 'energy_siting_transmission', 'energy_siting');
update cases set specific_topics = array_replace(specific_topics, 'environmental_conservation', 'environmental');
update cases set specific_topics = array_replace(specific_topics, 'ethnic/racial_equality_equity', 'ethnicracial');
update cases set specific_topics = array_replace(specific_topics, 'ethnic_racial_relations', 'ethnicracial_relations');
update cases set specific_topics = array_replace(specific_topics, 'fair_labor_standards', 'fair');
update cases set specific_topics = array_replace(specific_topics, 'financing_of_political_campaigns', 'financing');
update cases set specific_topics = array_replace(specific_topics, 'food_nutrition', 'food');
update cases set specific_topics = array_replace(specific_topics, 'food_nutrition_assistance', 'food_assistance');
update cases set specific_topics = array_replace(specific_topics, 'foreign_aid', 'foreign');
update cases set specific_topics = array_replace(specific_topics, 'freedom_of_information', 'freedom');
update cases set specific_topics = array_replace(specific_topics, 'freedom_of_speech', 'freedom_of');
update cases set specific_topics = array_replace(specific_topics, 'gender_equality_equity', 'gender');
update cases set specific_topics = array_replace(specific_topics, 'gender_issues', 'gender_identity');
update cases set specific_topics = array_replace(specific_topics, 'government_corruption', 'government');
update cases set specific_topics = array_replace(specific_topics, 'government_funding_of_education', 'government');
update cases set specific_topics = array_replace(specific_topics, 'hazardous_waste', 'hazardous');
update cases set specific_topics = array_replace(specific_topics, 'health_care_reform', 'health');
update cases set specific_topics = array_replace(specific_topics, 'higher_education', 'higher');
update cases set specific_topics = array_replace(specific_topics, 'highway_safety', 'highway');
update cases set specific_topics = array_replace(specific_topics, 'housing_planning', 'housing');
update cases set specific_topics = array_replace(specific_topics, 'human_rights', 'human');
update cases set specific_topics = array_replace(specific_topics, 'identity_politics', 'identity');
update cases set specific_topics = array_replace(specific_topics, 'indigenous_issues', 'indigenous');
update cases set specific_topics = array_replace(specific_topics, 'information_communications_technology', 'information');
update cases set specific_topics = array_replace(specific_topics, 'intergovernmental_relations', 'intergovernmental');
update cases set specific_topics = array_replace(specific_topics, 'internet_access', 'internet');
update cases set specific_topics = array_replace(specific_topics, 'jails_and_prisons', 'jails');
update cases set specific_topics = array_replace(specific_topics, 'judicial_reform', 'judicial');
update cases set specific_topics = array_replace(specific_topics, 'labor_unions', 'labor');
update cases set specific_topics = array_replace(specific_topics, 'land_use', 'land');
update cases set specific_topics = array_replace(specific_topics, 'longterm_care', 'longterm');
update cases set specific_topics = array_replace(specific_topics, 'lowincome_assistance', 'lowincome');
update cases set specific_topics = array_replace(specific_topics, 'mass/public_transport', 'masspublic');
update cases set specific_topics = array_replace(specific_topics, 'medical_liability', 'medical');
update cases set specific_topics = array_replace(specific_topics, 'mental_health', 'mental');
update cases set specific_topics = array_replace(specific_topics, 'monetary_policy', 'monetary');
update cases set specific_topics = array_replace(specific_topics, 'natural_gas_oil', 'natural');
update cases set specific_topics = array_replace(specific_topics, 'natural_resource_management', 'natural_resource');
update cases set specific_topics = array_replace(specific_topics, 'nuclear_energy', 'nuclear');
update cases set specific_topics = array_replace(specific_topics, 'open_data', 'open');
update cases set specific_topics = array_replace(specific_topics, 'pensions_retirement', 'pensions');
update cases set specific_topics = array_replace(specific_topics, 'public_amenities', 'public');
update cases set specific_topics = array_replace(specific_topics, 'quality_of_health_care', 'quality');
update cases set specific_topics = array_replace(specific_topics, 'refugee_resettlement', 'refugee');
update cases set specific_topics = array_replace(specific_topics, 'regional_global_governance', 'regional');
update cases set specific_topics = array_replace(specific_topics, 'regulatory_policy', 'regulatory');
update cases set specific_topics = array_replace(specific_topics, 'religious_rights', 'religious');
update cases set specific_topics = array_replace(specific_topics, 'research_development', 'research');
update cases set specific_topics = array_replace(specific_topics, 'resilience_planning_design', 'resilience');
update cases set specific_topics = array_replace(specific_topics, 'right_to_adequate_housing', 'right');
update cases set specific_topics = array_replace(specific_topics, 'right_to_representation', 'right');
update cases set specific_topics = array_replace(specific_topics, 'roads_and_highways', 'roads');
update cases set specific_topics = array_replace(specific_topics, 'sentencing_guidelines', 'sentencing');
update cases set specific_topics = array_replace(specific_topics, 'social_determinants_of_health', 'social');
update cases set specific_topics = array_replace(specific_topics, 'special_education', 'special');
update cases set specific_topics = array_replace(specific_topics, 'species_protection', 'species');
update cases set specific_topics = array_replace(specific_topics, 'sustainable_development', 'sustainable');
update cases set specific_topics = array_replace(specific_topics, 'transportation_planning', 'transportation');
update cases set specific_topics = array_replace(specific_topics, 'waste_disposal', 'waste');
update cases set specific_topics = array_replace(specific_topics, 'water_quality', 'water');
update cases set specific_topics = array_replace(specific_topics, 'weather_forecasting', 'weather');
update cases set specific_topics = array_replace(specific_topics, 'wilderness_protection', 'wilderness');
update cases set specific_topics = array_replace(specific_topics, 'youth_employment', 'youth');