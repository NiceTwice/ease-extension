import "./document_events_listener";

if (window.top === window) {
  const anchor = document.createElement('div');
  anchor.id = "new_ease_extension";
  document.body.insertBefore(anchor, document.body.childNodes[0]);
}