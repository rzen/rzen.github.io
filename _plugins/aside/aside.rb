module Jekyll
  class RenderAsideTagBlock < Liquid::Block

    def render(context)
      text = super
      "<aside>#{text}</aside>"
    end

  end
end

Liquid::Template.register_tag('aside', Jekyll::RenderAsideTagBlock)
