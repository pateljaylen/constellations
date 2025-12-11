# Wrapped Engine

The Wrapped Engine takes the raw inputs of a month — stories, photos, music,
sentiment — and transforms them into a collective narrative.

Components:
- Text analysis for themes, tone, and linguistic patterns.
- Sentiment trendline for the group.
- Highlight extraction (best quotes, pivotal stories).
- Photo clustering.
- Music aggregation.
- Group identity markers (values, boundaries, energy shifts).

The final output is a cinematic, scroll-based experience:
a portrait of the month the group lived through together.

Wrapped is not a summary.
It is a mirror — held up to the collective.


# Wrapped Engine (Pseudocode)

function generateWrapped(groupId, month):
    responses = fetchResponses(groupId, month)
    photos = collectPhotos(responses)
    songs = collectSongs(responses)
    sentiments = analyzeSentiment(responses)
    themes = clusterThemes(responses)
    highlights = extractHighlights(responses)

    wrapped = {
        "heroPhoto": selectHeroPhoto(photos),
        "openingLine": generateOpeningLine(themes, sentiments),
        "mood": sentiments.average,
        "themes": themes.top3,
        "storyHighlights": highlights,
        "songOfMonth": chooseSong(songs),
        "photoMosaic": buildMosaic(photos),
        "timeline": sentiments.timeline,
        "closingReflection": generateClosingReflection(themes),
    }

    return wrapped

Narrative:
Wrapped is a narrative system — an algorithm holding a heartbeat.