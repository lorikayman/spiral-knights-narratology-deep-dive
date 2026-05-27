-- conlang heading decoration
--
-- some h4,h5,h6 is followed by a standalone `[GLYPHS]{.conlang}` paragraph
--
-- Filter walks each block list, and where such a heading is immediately
-- followed by that paragraph, and then merges the two into a single div:
--
-- <div class="conlang-heading">
--   <h4 id="...">Heading Text</h4>
--   <span class="conlang">GLYPHS</span>
-- </div>

-- helper
--
-- el
--  node element to check for classes
-- name
--  class name to check presence for
local function has_class(el, name)
  for _, c in ipairs(el.classes) do
    if c == name then return true end
  end
  return false
end

-- Return the conlang Span block
-- inline is a span with class `conlang` else nil.
local function conlang_span_of(block)
  if block == nil then return nil end

  if block.t ~= "Para" and block.t ~= "Plain" then
    return nil
  end

  local span = nil

  for _, inline in ipairs(block.content) do
    if inline.t == "Space" or inline.t == "SoftBreak" then
      -- ignore surrounding whitespace
    elseif inline.t == "Span" and has_class(inline, "conlang") then
      if span ~= nil then
        return nil
      end
      span = inline
    else
      return nil
    end
  end

  return span
end

local function make_div(header, span)
  local tag = "h" .. header.level
  local glyphs = pandoc.utils.stringify(span.content)
  -- render heading inlines to html (preserves code/links/emph)
  local text_html = pandoc.write(
    pandoc.Pandoc({
      pandoc.Plain(header.content),
    }),
    "html5"
  )
  text_html = text_html:gsub("%s+$", "")

  local id_attr = header.identifier ~= "" and string.format(' id="%s"', header.identifier) or ""

  local html = string.format(
    [[
      <div class="conlang-heading">
        <%s%s>%s</%s>
        <span class="conlang">%s</span>
      </div>
    ]],
    tag, id_attr, text_html, tag, glyphs
  )
  return pandoc.RawBlock("html", html)
end

-- filter initiator func
function Blocks(blocks)
  local out = pandoc.List({})

  local i = 1
  while i <= #blocks do
    local b = blocks[i]
    local processed = false

    -- h4+
    if b.t == "Header" and b.level >= 4 then
      local span = conlang_span_of(blocks[i + 1])

      -- conlang span block found
      if span then
        out:insert(make_div(b, span))
        i = i + 2
        processed = true
      end
    end

    if not processed then
      out:insert(b)
      i = i + 1
    end
  end

  return out
end
