SELECT
    cases.id,
    cases.type,
    cases.original_language,
    cases.issue,
    cases.communication_mode,
    cases.communication_with_audience,
    cases.content_country,
    cases.decision_method,
    cases.end_date,
    cases.facetoface_online_or_both,
    cases.facilitated,
    cases.voting,
    cases.number_of_meeting_days,
    cases.ongoing,
    cases.post_date,
    cases.published,
    cases.start_date,
    cases.total_number_of_participants,
    cases.updated_date,
    cases.targeted_participant_demographic,
    cases.kind_of_influence,
    cases.targeted_participants_public_role,
    cases.targeted_audience,
    cases.participant_selection,
    cases.specific_topic,
    cases.staff_type,
    cases.type_of_funding_entity,
    cases.typical_implementing_entity,
    cases.typical_sponsoring_entity,
    cases.who_else_supported_the_initiative,
    cases.who_was_primarily_responsible_for_organizing_the_initiative,
    to_json(
    	COALESCE(
    		cases.location,
    		('', '', '', '', '', '', '', '', '')::geolocation
    	)
    ) AS location,
    to_json(cases.lead_image) AS lead_image,
    to_json(COALESCE(cases.other_images, '{}')) AS other_images,
    to_json(COALESCE(cases.files, '{}')) AS files,
    to_json(COALESCE(cases.videos, '{}')) AS videos,
    to_json(COALESCE(cases.tags, '{}')) AS tags,
    localized_texts.body,
    localized_texts.title,
    to_json(author_list.authors) authors,
    to_json(get_related_nouns('case', 'case', ${thingid}, ${lang} )) related_cases,
    to_json(get_related_nouns('method', 'case', ${thingid}, ${lang} )) related_methods,
    to_json(get_related_nouns('organization', 'case', ${thingid}, ${lang} )) related_organizations,
    bookmarked('case', ${thingid}, ${userId})
FROM
    cases,
    localized_texts,
    (
        SELECT
            array_agg((
                authors.user_id,
                authors.timestamp,
                users.name
            )::author) authors,
            authors.thingid
        FROM
            authors,
            users
        WHERE
            authors.user_id = users.id
        GROUP BY
            authors.thingid
    ) AS author_list
WHERE
    cases.id = localized_texts.thingid AND
    localized_texts.language = ${lang} AND
    author_list.thingid = cases.id AND
    cases.id = ${thingid}
;
