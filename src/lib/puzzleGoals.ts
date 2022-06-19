export const PUZZLE_GOALS = [
    "You close your mind to all that you could be",
    "Everything is great now that I have eradicated the EMMI",
    "Listen up my fellow Chozo for I have a plan",
    "A scientist would not ever believe the chaos that commands the galaxy",
    "Only a superior warrior could command an attack this powerful",
    "Put these foolish thoughts to rest and fulfill your purpose",
    "We continue to extract intelligence from the Chozo scans",
    "All difficulties are actually ways by which to become more powerful",
    "Proceed on to the next place with all your prowess",
    "If only you could glimpse yourself the way my eyes have",
    "Spare me your lies because he already told me who actually did this",
    "I truly want to hold your hand and bring you with me",
    "Somehow Raven Beak has returned with an even longer beak",
    "Do you know if they are ready to submit their order",
    "There are seven more soldiers who disappoint their tribe",
    "Stand on this planet and turn your eyes up to my homeworld",
    "The mind of a leader must know the physical from the symbolic"
]

export const getRandomGoal = () => {
    return PUZZLE_GOALS[Math.round(Math.random() * PUZZLE_GOALS.length)]
}