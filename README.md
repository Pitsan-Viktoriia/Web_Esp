## **Автори**  

Над цим проєктом працювали: Піцан Вікторія та Грановська Яна.  
This project was developed by Viktoriia Pitsan and Yana Hranovska.

# Django Project Setup

This README will guide you through setting up a Django project in any development environment, including creating and activating a Python virtual environment, installing Django (or other dependencies), running your Django application, and optionally configuring an IDE or editor.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating a Virtual Environment](#creating-a-virtual-environment)
3. [Activating the Virtual Environment](#activating-the-virtual-environment)
4. [Installing Dependencies](#installing-dependencies)
5. [Running the Django Server](#running-the-django-server)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Python 3.x**: Django supports Python 3.6 and above. Verify your Python version:

  ```bash
  python3 --version
  ```

* **pip** (Python package installer): Usually installed alongside Python 3.x.

  ```bash
  pip --version
  ```

* **git** (optional): If you are cloning a repository or using version control.

  ```bash
  git --version
  ```

* **Database (optional)**: Django defaults to SQLite, which requires no additional setup. If you prefer PostgreSQL, MySQL, or another database, ensure the database server is installed and running.

---

## Creating a Virtual Environment

A virtual environment keeps your project’s dependencies isolated from system-wide packages. It’s recommended to create a new venv for each Django project.

1. Open a terminal and navigate to your project directory (where you want `manage.py` to live), or clone an existing repository:

   ```bash
   # If starting a new project:
   mkdir my_django_project
   cd my_django_project

   # If cloning an existing project:
   git clone <repository_url> my_django_project
   cd my_django_project
   ```

2. Create a virtual environment. Common conventions are naming it `venv/` or `.venv/`:

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

Before installing any packages, activate the venv so that `pip` and `python` commands use this isolated environment.

1. In your terminal, ensure you are in the project root (the same directory that contains `venv/`):

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

2. After activation, your shell prompt should show `(venv)` at the front:

   ```bash
   (venv) user@machine ~/…/my_django_project $
   ```

3. Confirm you are using the venv’s Python and pip:

   ```bash
   which python   # (macOS/Linux) or: where python (Windows)
   which pip      # (macOS/Linux) or: where pip (Windows)
   ```

   Both paths should point inside `…/my_django_project/venv/`.

---

## Installing Dependencies

Once the virtual environment is activated, install Django (and any other required packages) into the venv.

1. **If you have a `requirements.txt` file** (recommended in many projects):

   ```bash
   pip install -r requirements.txt
   ```

   This installs Django and any other libraries pinned in `requirements.txt`. After installation, verify:

   ```bash
   pip freeze | grep Django
   ```

   You should see something like `Django==4.2.x` (or the version specified in your project).

2. **If you don’t have a `requirements.txt`** or need to install Django manually:

   ```bash
   pip install django
   ```

   Optionally, to install a specific version (e.g. Django 4.2):

   ```bash
   pip install django==4.2
   ```

   Then verify:

   ```bash
   pip show django
   ```

   The output confirms Django’s version and installation path.

3. **Start a new Django project (optional)**: If you are beginning from scratch, create a new project and application:

   ```bash
   django-admin startproject mysite .
   python manage.py startapp myapp
   ```

   Adjust `mysite` and `myapp` to your desired names. The trailing `.` tells Django to place project files in the current directory instead of a nested folder.

---

## Running the Django Server

With the venv active and Django installed, you can now run management commands.

1. In your terminal (ensuring `(venv)` appears in the prompt), run:

   ```bash
   python manage.py runserver
   ```

   By default, the development server runs at `http://127.0.0.1:8000/`.

2. If you see messages about unapplied migrations, run:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. Once the server is running, open your browser at `http://127.0.0.1:8000/` to view your Django application.

4. To create a superuser (admin account), run:

   ```bash
   python manage.py createsuperuser
   ```

   Follow the prompts to set a username, email, and password. You can then log in at `http://127.0.0.1:8000/admin/`.

---

## Summary

By following this README, you will:

1. Create an isolated Python virtual environment for your Django project.
2. Install Django (and other dependencies) into that venv.
3. Run your Django `manage.py` commands (like `runserver`, `makemigrations`, `migrate`) without encountering import errors.

If you still face issues, double-check each step—especially ensuring the virtual environment is activated and that Django is installed into it. Happy coding!
