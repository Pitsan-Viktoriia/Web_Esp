# Django Project Setup in VS Code

This README will guide you through setting up a Django project in a Visual Studio Code (VS Code) workspace, including creating and activating a Python virtual environment, installing Django (or other dependencies), configuring VS Code to use the correct interpreter, and running your Django application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating a Virtual Environment](#creating-a-virtual-environment)
3. [Activating the Virtual Environment](#activating-the-virtual-environment)
4. [Installing Dependencies](#installing-dependencies)
5. [Configuring VS Code](#configuring-vs-code)
6. [Running the Django Server](#running-the-django-server)
7. [Optional: Persisting VS Code Settings](#optional-persisting-vs-code-settings)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Python 3.x**: Django supports Python 3.6 and above. You can verify your Python version by running:

  ```bash
  python3 --version
  ```

* **pip** (Python package installer): Usually installed alongside Python 3.x.

  ```bash
  pip --version
  ```

* **VS Code**: Download and install from [Visual Studio Code website](https://code.visualstudio.com/).

* **VS Code Python Extension**: Inside VS Code, go to the Extensions panel (⇧⌘X on macOS or Ctrl+Shift+X on Windows/Linux) and install the official **Python** extension by Microsoft.

---

## Creating a Virtual Environment

A virtual environment keeps your project’s dependencies isolated from system-wide packages. It’s recommended to create a new venv for each Django project.

1. Open VS Code and open your project folder (the folder containing `manage.py`).

   * **File → Open Folder…** and select `/workspaces/Web_Esp/hola_espanol` (or your project directory).

2. Open the integrated terminal in VS Code:

   * **View → Terminal** (or press `` Ctrl+` ``).

3. Check if a virtual environment already exists. Common names are `venv/`, `.venv/`, or `env/`. If you see a `venv/` folder, skip to [Activating the Virtual Environment](#activating-the-virtual-environment).

4. If there is no existing venv, create one:

   * On **macOS/Linux**:

     ```bash
     python3 -m venv venv
     ```
   * On **Windows (PowerShell)**:

     ```powershell
     python -m venv venv
     ```
   * On **Windows (CMD.exe)**:

     ```cmd
     python -m venv venv
     ```

   This creates a folder named `venv/` inside your project directory.

---

## Activating the Virtual Environment

Before installing any packages, activate the venv so that `pip` and `python` point to this isolated environment.

1. In the VS Code integrated terminal (ensure your working directory is your project root):

   * **macOS / Linux**:

     ```bash
     source venv/bin/activate
     ```
   * **Windows (PowerShell)**:

     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   * **Windows (CMD.exe)**:

     ```cmd
     venv\Scripts\activate.bat
     ```

2. After activation, your shell prompt should change to show `(venv)` at the front:

   ```bash
   (venv) user@machine ~/…/hola_espanol $
   ```

3. Confirm you are using the venv’s Python and pip:

   ```bash
   which python   # (or: where python on Windows)
   which pip      # (or: where pip on Windows)
   ```

   Both paths should point inside `…/hola_espanol/venv/`.

---

## Installing Dependencies

Once the virtual environment is activated, install Django (and any other required packages).

1. **If you have a `requirements.txt` file** (recommended in many projects):

   ```bash
   pip install -r requirements.txt
   ```

   This installs Django and any other libraries pinned in `requirements.txt`. After installation, verify:

   ```bash
   pip freeze | grep Django
   ```

   You should see something like `Django==4.2.x` (or a different version, depending on your project).

2. **If you don’t have a `requirements.txt`** or need to install Django manually:

   ```bash
   pip install django
   ```

   Optionally, to install a specific version:

   ```bash
   pip install django==4.2
   ```

   Then verify:

   ```bash
   pip show django
   ```

   The output confirms Django’s version and installation path.

---

## Configuring VS Code

You want VS Code’s editor, linting, debugging, and the integrated terminal all to use the same venv interpreter.

1. **Select the Python interpreter** for this workspace:

   * Press **Ctrl+Shift+P** (Windows/Linux) or **⇧⌘P** (macOS) to open the Command Palette.
   * Type `Python: Select Interpreter` and press Enter.
   * Choose the interpreter that points to `…/hola_espanol/venv/bin/python` (macOS/Linux) or `…\hola_espanol\venv\Scripts\python.exe` (Windows).

   VS Code will now know to use your venv for IntelliSense, linting, and debugging.

2. **(Optional) Persist the interpreter setting** by adding to `.vscode/settings.json`:

   ```jsonc
   {
     // Points VS Code to your venv’s Python executable:
     "python.defaultInterpreterPath": "${workspaceFolder}/venv/bin/python"
   }
   ```

   * On **Windows**, adjust accordingly:

     ```jsonc
     "python.defaultInterpreterPath": "${workspaceFolder}\\venv\\Scripts\\python.exe"
     ```

   Having this file in your `.vscode/` folder ensures teammates (or you, on another machine) will automatically use the correct Python interpreter.

---

## Running the Django Server

With the venv active and Django installed, you can now run management commands.

1. In the integrated terminal (make sure `(venv)` is in the prompt):

   ```bash
   python manage.py runserver
   ```
2. If you see messages about unapplied migrations, you may need to run:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
3. Once the server starts, open your browser at [http://127.0.0.1:8000/](http://127.0.0.1:8000/) to view your Django application.

---

## Optional: Persisting VS Code Settings

If you want a reproducible workspace setup, commit a `.vscode/settings.json` file containing:

```jsonc
{
  "python.defaultInterpreterPath": "${workspaceFolder}/venv/bin/python",
  // (Windows users: use "${workspaceFolder}\\venv\\Scripts\\python.exe")
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black"
}
```

This ensures:

* The correct interpreter is selected automatically.
* Linting with Pylint is enabled.
* Formatting with Black, if you use it.

---

## Troubleshooting

* **`ModuleNotFoundError: No module named 'django'`**:

  1. Confirm you activated the virtual environment. Your shell prompt should show `(venv)`. If not, run:

     ```bash
     source venv/bin/activate   # macOS/Linux
     .\venv\Scripts\Activate.ps1  # Windows PowerShell
     ```
  2. Confirm that `pip install django` was run inside the activated venv. Check:

     ```bash
     pip show django
     ```

     Ensure the “Location” points to `…/hola_espanol/venv/lib/...` (macOS/Linux) or `…\hola_espanol\venv\Lib\site-packages` (Windows).
  3. In VS Code, ensure **Python: Select Interpreter** is set to the venv’s `python`.

* **Multiple Python Versions**:
  If you have Python 3.x and Python 2.x installed, running `python` vs. `python3` might point to different executables. Always check with:

  ```bash
  python --version
  python3 --version
  ```

  If necessary, adjust `python3 -m venv venv` or explicitly call `python3` when creating the venv.

* **`pip` vs. `pip3`**:
  On some systems, `pip` may point to Python 2’s installer. Use `pip3 install <package>` if you notice discrepancies.

* **VS Code not recognizing venv**:
  If after selecting the interpreter, linting or IntelliSense still fails, restart VS Code to reload settings. Verify in the bottom-left corner the correct interpreter is shown.

---

## Summary

By following this README, you will:

1. Create an isolated Python virtual environment for your Django project.
2. Install Django (and other dependencies) into that venv.
3. Configure VS Code to use the same venv interpreter for coding, linting, and debugging.
4. Run your Django `manage.py` commands (like `runserver`, `makemigrations`, `migrate`) without encountering the `ModuleNotFoundError: No module named 'django'` error.

If you still face issues, double-check each step—especially ensuring the virtual environment is activated and VS Code’s selected interpreter matches it. Happy coding!


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