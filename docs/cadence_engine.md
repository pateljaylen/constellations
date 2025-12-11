# Cadence Engine

The cadence engine assigns each member of a group their reflection week.

Inputs:
- Group size (7–25)
- Frequency (weekly cycle)
- Buffer periods (holidays, summer travel)
- Completion rate (everyone contributes once per month)

Outputs:
- A rotation schedule where each person receives their 4 questions
- A guarantee that no two cycles cluster around the same people
- Optional recovery slots for members who miss their week

Principles:
- Rhythm creates trust.
- Structure creates safety.
- Spacing creates sustainability.

The engine is invisible to users, but essential to the ritual.



# Cadence Engine (Pseudocode)

function generateMonthlyCadence(groupMembers, month):
    shuffled = shuffle(groupMembers)
    weeks = splitIntoWeeks(shuffled, 4)  // 4 cycles per month
    assignments = {}

    for i in range(len(weeks)):
        for member in weeks[i]:
            assignments[member] = {
                "week": i + 1,
                "questions": select4RandomQuestions(),
                "month": month
            }

    return assignments

function select4RandomQuestions():
    return sample(questionDeck, 4)

Narrative:
The cadence engine ensures every member contributes once per month,
with enough spacing for rest, travel, and real life.