# Secret Santa Draw

A small Secret Santa site. No server, no sign-up. Works on GitHub Pages for free.

## Files

```
index.html        Home page with links to the other pages
wishlist.html     Questionnaire everyone fills out
organize.html     Organizer: event details, people, rules, draw
reveal.html       Private page each person opens to see their match
css/style.css     All styles
js/common.js      Shared helpers and the list of questions
js/draw.js        The matching logic (no page code)
js/home.js        Home page; redirects links from the old one-page version
js/wishlist.js    Wishlist page
js/organize.js    Organizer page
js/reveal.js      Reveal page
```

To change the questions, edit `QUESTIONS` at the top of `js/common.js`. Every page uses that list.

The scripts are plain `<script>` files, not ES modules, so the site also works if you open `index.html` straight from your computer.

## Put it on GitHub Pages

1. Create a new public repo on GitHub, for example `secret-santa`.
2. Upload everything in this folder, keeping the `css` and `js` folders (Add file > Upload files, then drag the whole folder in).
3. Go to Settings > Pages.
4. Under "Build and deployment", set Source to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
5. After a minute your site is live at `https://YOUR-USERNAME.github.io/secret-santa/`.

## How to run your exchange

1. Open **organize.html**. Fill in the event name, budget and date.
2. Click **Copy wishlist link for participants** and send it to everyone.
3. Each person fills out the questionnaire and sends you back their code.
4. Paste the codes under **People**. You can also type names and wishlists in yourself.
5. Under **Rules**, add pairs who shouldn't draw each other (couples, roommates, last year's pairs).
6. Click **Draw names**, then **Copy message** for each person and send it to them.

## Good to know

- Your organizer list is saved in your browser on that device. Use the same browser to come back to it.
- Drawing again creates all new matches. Links you already sent will still show the old match.
- The match in each link is scrambled, not encrypted. It stops accidental peeking, but a tech-savvy person could decode it.
- If the draw fails, your rules leave someone with no one they're allowed to draw. Remove a rule or uncheck "Avoid two people drawing each other".
