-- citation code -> breakable span
--
-- Inline game-text quotes are written as `code` node spans
-- <code> -> <span class="citation">

return {
  {
    traverse = "topdown",
    -- keep _headings_ `code`, dont descend
    Header = function(el) return el, false end,
    -- keep `del code`, dont descend
    Strikeout = function(el) return el, false end,
    -- this case
    Code = function(el)
      local attr = el.attr

      attr.classes:insert("citation")

      return pandoc
          .Span({
            pandoc.Str(el.text)
          }, attr)
    end,
  },
}
