# InsPhish — Instagram Phishing Simulation (Educational Research)

> **DISCLAIMER**: This project is intended **strictly for educational and cybersecurity awareness research purposes only**. Phishing attacks are **illegal** and unethical when used against real users without consent. Never deploy this against real users. Use only in a controlled lab/sandbox environment to understand how phishing attacks work and how to defend against them.

---

##  Project Overview

**InsPhish** is a phishing simulation website that mimics the Instagram login experience. It is designed to demonstrate how social engineering and credential-harvesting attacks are constructed — educating developers, security researchers, and students about phishing techniques so they can better recognize and defend against them.

The project includes:
- A **lure landing page** that claims to offer "Free Instagram Followers"
- A **fake app-style popup window** that mimics a desktop application
- An **Instagram login clone page** to simulate credential capture
- **Obfuscated HTML/JS** (as seen in real-world phishing kits) to study code obfuscation

---

## Project Structure

```
website-main/
│
├── index.html              # Landing page — "Get Free Instagram Followers"
├── main.html               # Obfuscated phishing popup window page
├── insta.html              # Instagram login page clone (credential phish)
│
├── script.js               # Deobfuscated JS: draggable popup window logic
├── decode_main.js          # Node.js utility to decode/deobfuscate main.html
│
├── style.css               # Base stylesheet for landing & popup pages
├── styleinsta.css          # Stylesheet for the Instagram login clone
│
├── logo.svg                # Logo SVG asset
├── ssl.svg                 # SSL/padlock icon SVG asset
│
├── css/                    # Vendor CSS library folder
│   ├── css-bootstrap.css       # Bootstrap grid & components
│   ├── css-animate.css         # CSS animation library
│   ├── css-font-icons.css      # Font icon set
│   ├── css-magnific-popup.css  # Lightbox/popup styles
│   ├── css-fonts.css           # Custom web font declarations
│   ├── css-custom.css          # Custom override styles
│   ├── css-dark.css            # Dark mode styles
│   ├── landing-landing.css     # Landing page specific styles
│   ├── gwaa.net-style.css      # Full site stylesheet (framework base)
│   └── Hello.txt               # Placeholder/notes file
│
└── images/                 # Image assets folder
    ├── images-instapasspng-min.png  # Hero image on landing page
    ├── phone1.jpg                   # Phone mockup image 1
    ├── phone2.jpg                   # Phone mockup image 2
    ├── phone3.jpg                   # Phone mockup image 3
    └── Gh.txt                       # Placeholder/notes file
```

---

## File Descriptions

### `index.html` — Landing / Lure Page
- Entry point of the phishing kit
- Presents a convincing "Get Free Instagram Followers" page to attract victims
- Includes a **"Get free followers"** CTA button that redirects to `main.html`
- Uses Bootstrap grid layout with a responsive hero section
- Loads vendor CSS from the `css/` folder and custom styles from `style.css`

### `main.html` — Obfuscated Popup Window Page
- Contains **heavily obfuscated JavaScript** (obfuscated at `phpkobo.com`)
- At runtime, decodes and renders a **fake desktop application popup window**
- The popup mimics a Windows/desktop app UI with a title bar, minimize, maximize, and close buttons
- Embeds the Instagram login clone (`insta.html`) inside an iframe within the popup
- Demonstrates real-world phishing kit obfuscation techniques

### `insta.html` — Instagram Login Clone
- Pixel-accurate clone of the Instagram login page
- Includes the left-side phone carousel animation and right-side login form
- Features:
  - Username/email and password input fields
  - "Log in" button with loading/submitting state
  - "Forgot password?" and "Sign up" links
  - App store download badges
  - Instagram footer links
- Form submission can be wired to capture credentials (in a research/lab context)

### `script.js` — Deobfuscated Popup Window Controller
Contains the fully **decoded and commented** JavaScript for the popup window:
- **Minimize / Square / Exit button** hover effects (background color transitions)
- **Draggable window** logic using jQuery (drag by title bar)
- **Exit button**: hides the popup window (`display: none`)
- **Square/maximize button**: toggles between 40% and 70% width
- **Click-me button**: fades in the popup window (300ms fade)

### `decode_main.js` — Deobfuscation Utility (Node.js)
A research utility script used to **decode the obfuscated `main.html`**:
- Uses Node.js `vm` module to run the obfuscated code in a sandboxed environment
- Constructs a **fake browser/document environment** to safely intercept `document.write()` calls
- Captures the decoded HTML output and saves it to `main_decoded.html`
- Useful for studying how phishing kits hide their real content from scanners

### `style.css` — Landing Page & Popup Styles
- General styles for the landing page and popup window container
- Popup window chrome: title bar, minimize/maximize/close buttons, iframe content area
- Responsive adjustments for mobile screens

### `styleinsta.css` — Instagram Clone Stylesheet
- Faithful recreation of Instagram's visual design
- CSS variables for brand colors (`--blue`, `--gray-border`, `--muted`, etc.)
- Responsive split layout: left panel (headline + phone carousel) / right panel (login form)
- Phone carousel: 3-frame animation cycling `phone1.jpg`, `phone2.jpg`, `phone3.jpg`
- Form styles: input fields, buttons, dividers, app store badges, footer links

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | Vanilla CSS, Bootstrap 4 |
| Scripting | Vanilla JavaScript, jQuery 3.5.1 |
| Fonts | Google Fonts (Source Sans Pro, Roboto) |
| Animations | CSS keyframes, jQuery `.fadeIn()` |
| Obfuscation | phpkobo HTML Obfuscator |
| Deobfuscation | Node.js (`vm`, `fs` modules) |
| Ads (lure page) | Google AdSense |

---

## 🚀 Usage (Lab / Research Environment Only)

### Running Locally
Since this is a static website, simply open the files in a browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Use a local server (recommended to avoid CORS issues)
npx serve .
# or
python -m http.server 8080
```

Then navigate to: `http://localhost:8080`

### Deobfuscating main.html (Research)
To extract and study the decoded content of `main.html`:

```bash
# Prerequisites: Node.js installed

# Step 1: Extract the inner obfuscated JS from main.html manually
# and save it as inner_code.js

# Step 2: Run the decoder
node decode_main.js

# Output: main_decoded.html (the decoded HTML content)
```

---

##  Attack Flow Diagram

```
Victim visits index.html
        │
        ▼
"Get Free Followers" button clicked
        │
        ▼
main.html loads (obfuscated JS decodes at runtime)
        │
        ▼
Fake desktop popup window appears
        │
        ▼
Instagram login clone (insta.html) loads inside iframe
        │
        ▼
Victim enters credentials → Form submits → Credentials captured
```

---

##  Security Research Notes

### Obfuscation Techniques Used (main.html)
- **Character encoding substitution**: uses Cyrillic Unicode characters as property name lookups (`ã('Ϯ')` = `'length'`)
- **String scrambling**: key strings are shuffled and rebuilt at runtime
- **Self-modifying code**: the outer `Function(...)()` wrapper evaluates the inner payload dynamically
- **Anti-debugging**: charset check (`document.characterSet.toUpperCase() != 'UTF-8'`) to detect sandbox environments


