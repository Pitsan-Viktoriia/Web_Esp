import os

def get_html_message(message):
        template_path = os.path.abspath(os.path.join(os.path.abspath(__file__), '..', 'templates', 'message.html'))    # this expression gets absolute path to register.html file
        with open(template_path, 'r') as f:
            return f.read().format(message)