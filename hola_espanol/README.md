## Exercises

### checkbox

JSON['content']:
{
    "name": Name of exercise,
    "items":
        [
            {
                "text": text,
                "options": [option1, option2, ...],
                "correct_option_index": correct option index
            },
        ]
}

### dropdown

JSON['content']:
{
    "name": Name of exercise,
    "items":
        [
            {
                "text": text,
                "gaps":
                    [
                        {
                            "text_position_index": text_position_index,
                            "options": [option1, option2, ...],
                            "correct_option_index": correct option index
                        }
                    ]
            }
        ],
}

### fillgap

JSON['content']:
{
    "name": Name of exercise,
    "items":
        [
            {
                "text": text,
                "gaps":
                    [
                        {
                            "text_position_index": text_position_index,
                            "correct_answer": correct answer
                        }
                    ]
            }
        ],
}


### flashcard

JSON['content']:
{
    "name": Name of exercise,
    "items":
        [{"front": front, "back": back}, ...],
}