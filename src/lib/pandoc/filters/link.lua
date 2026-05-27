-- link formatter
function Link(el)
  -- check whether link leads outside of pdf
  local is_external =
      not el.target:match("^#") and
      not el.target:match("^/") and
      el.target:match("^https?://")

  if is_external then
    el.attributes.rel = "noopener noreferrer"
    el.attributes.target = "_blank"
    el.attributes.class = (el.attributes.class or "") .. " link-external"
    return el
  else
    return el
  end
end
