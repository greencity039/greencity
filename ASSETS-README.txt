GREENCITY ASSETS

REQUIRED — the site will not display correctly without these:

images/
  greencity-logo.png
  greencity-hero.jpg
  bin-washing.jpg

videos/
  bin-washing.mp4

If your original GreenCity images/video use different filenames, keep
the existing filenames and update only the matching src/poster paths
in index.html.


OPTIONAL — new homepage sections reference these. Until you add them,
each section shows a clean built-in placeholder instead of a broken
image, so the site still works and looks intentional — but it will
look far better once real photos are added:

images/gallery-1.jpg   "Recent Work" slideshow, slide 1
images/gallery-2.jpg   "Recent Work" slideshow, slide 2
images/gallery-3.jpg   "Recent Work" slideshow, slide 3
images/gallery-4.jpg   "Recent Work" slideshow, slide 4
images/before.jpg      Before/After slider — the "before" photo
images/after.jpg       Before/After slider — the "after" photo

Recommended: 1600x900px or similar 16:9 landscape photos, so they
crop cleanly into the slideshow and slider frames.


VEHICLE BRAND LOGOS — the "Owners trust us with cars like these"
section currently shows plain circular monogram badges (e.g. "BM"
for BMW) instead of real brand logos. This is intentional: brand
logos are trademarked, and I don't have licensed copies of them to
place on your site. If you want real logos there, you (or GreenCity)
will need to source your own properly licensed logo files (many
brands publish press-kit assets for this kind of use) and swap them
into the .brand-badge elements in index.html. Using real logos also
means being careful not to imply the manufacturers endorse or
partner with GreenCity — index.html already includes a disclaimer
line under that section for this reason.


The code files in this refresh do not contain your original image,
video, or logo files, so all of the above must be uploaded separately
to GitHub.
