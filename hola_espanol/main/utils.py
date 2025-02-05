import os

def get_html_message(message):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'message_ua.html'))    # this expression gets absolute path to register.html file
        with open(template_path, 'r', encoding='utf-8') as f:
            return f.read().format(message)