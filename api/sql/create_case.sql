WITH insert_case as (
  INSERT into cases (
    original_language, issue, communication_mode,
    communication_with_audience, content_country,
    decision_method, end_date, facetoface_online_or_both,
    facilitated, voting, number_of_meeting_days,
    ongoing, post_date, published, start_date,
    total_number_of_participants, updated_date,
    targeted_participant_demographic,
    kind_of_influence, targeted_participants_public_role,
    targeted_audience, participant_selection,
    specific_topic, staff_type, type_of_funding_entity,
    typical_implementing_entity, typical_sponsoring_entity,
    who_else_supported_the_initiative,
    who_was_primarily_responsible_for_organizing_the_initiative,
    location, lead_image, other_images,
    files, videos, tags, featured
  )
  VALUES
    (
      ${language}, null, null, null, null, null, null,
      null, null, 'none', null, false, 'now',
      true, 'now', null, 'now', 'General Public',
      null, 'Lay Public', 'General Public',
      'Open to all', null, null, null, null,
      null, null, null, ${location:raw}, ${lead_image:raw},
      '{}', '{}', ${videos:raw}, '{}', false
    ) RETURNING id as case_id
),
insert_author as (
  INSERT into authors(user_id, timestamp, thingid)
  VALUES
    (${user_id}, 'now', (select case_id from insert_case))
)

INSERT INTO case__localized_texts(body, title, language, case_id)
VALUES
  (
    ${body},
    ${title},
    ${language},
    (select case_id from insert_case)
  ) RETURNING case_id
;
