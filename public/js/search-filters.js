const searchFilters = {
  case: [
    {
      sectionKey: "overview",
      fieldNameKeys: ["general_issues", "tags"]
    },
    {
      sectionKey: "location",
      fieldNameKeys: ["country", "scope_of_influence"]
    },
    {
      sectionKey: "purpose_and_approach",
      fieldNameKeys: ["purposes", "approaches", "public_spectrum"]
    },
    {
      sectionKey: "participants",
      fieldNameKeys: ["open_limited", "recruitment_method"]
    },
    {
      sectionKey: "process",
      fieldNameKeys: ["method_types", "tools_techniques_types", "facetoface_online_or_both"]
    },
    {
      sectionKey: "organizers_supporters",
      fieldNameKeys: ["organizer_types", "funder_types"]
    },
    {
      sectionKey: "evidence_of_impact",
      fieldNameKeys: ["change_types"]
    },
  ]
}

// sample query string to send to server for results
// /?query=free+form+text+search&tags=accessibility,animal&general_issues=agriculture,arts&country=ca
