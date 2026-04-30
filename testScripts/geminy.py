from groq import Groq
from dotenv import load_dotenv

load_dotenv()


def main():
    client = Groq()

    instructions = """" you are an expert in spoerts analytics , you will be provided a json file with 2 fighters for an upcoming fight and
    their stats , compare them and and make a prediction on who the winner will be ,
    reply back with the format in json
    data:{ analysis:{
                fighter_1: { name,
                    Advantages: analyze,
                    Disadvantages: analyze,
                    Performance Index: interpret},
                fighter_2: { name,
                    Advantages: analyze,
                    Disadvantages: analyze,
                    Performance Index: interpret},
                winer:{name:fighter_id , factor: knockout , points, comment:'your short comment'} }"""

    file = get_jason()

    models = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "qwen/qwen3-32b",
    ]

    prompt = f"{instructions}, this is the fight card {file} only reply back with the json i asked"

    for model in models:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
        print(f"\n--- {model} ---")
        print(response.choices[0].message.content)


def get_jason() -> str:

    with open("fight_card.json", 'r') as f:
        file = f.read()

    return file


if __name__ == "__main__":
    main()
