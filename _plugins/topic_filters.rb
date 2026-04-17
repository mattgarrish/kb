module Jekyll
  module TopicFilter
    def appliesTo_section(input, site, page)
      lang = page['language'];
      sec = <<SEC
<section id="applies-to">
	<h3>Applies To</h3>
	<table>
		<tbody>
			<tr>
				<th><a href="https://www.w3.org/TR/epub/">EPUB 3</a></th>
				<th><a href="http://idpf.org/epub/201/">EPUB 2</a></th>
				<th><a href="https://www.w3.org/TR/audiobooks/">Audiobooks</a></th>
			</tr>
			<tr>
SEC
	  
	  if input.include?('EPUB3')
        sec += "<td class=\"yes\">" + site['data'][lang]['ui']['appliesTo']['yes'] + "</td>"
	  else
        sec += "<td class=\"no\">" + site['data'][lang]['ui']['appliesTo']['no'] + "</td>"
	  end
	  
	  if input.include?('EPUB2')
        sec += "<td class=\"yes\">" + site['data'][lang]['ui']['appliesTo']['yes'] + "</td>"
	  else
        sec += "<td class=\"no\">" + site['data'][lang]['ui']['appliesTo']['no'] + "</td>"
	  end

	  if input.include?('Audiobooks') or input.include?('Audiobooks*')
	    if input.include?('Audiobooks')
          sec += "<td class=\"yes\">" + site['data'][lang]['ui']['appliesTo']['yes'] + "</td>"
        else
          sec += "<td class=\"partial\">" + site['data'][lang]['ui']['appliesTo']['partial'] + " <a href=\"#aud01\" role=\"doc-noteref\">*</a></td>"
        end
	  else
        sec += "<td class=\"no\">" + site['data'][lang]['ui']['appliesTo']['no'] + "</td>"
	  end
	  
	  sec += <<END
			</tr>
		</tbody>
	</table>
END

      if input.include?('Audiobooks*')
        sec += "<p id=\"aud01\" class=\"small\" role=\"doc-footnote\">" + site['data'][lang]['ui']['appliesTo']['partialNote'] + "</p>"
      end
      
      sec += "</section>"
      
      sec
    end
  end
end

Liquid::Template.register_filter(Jekyll::TopicFilter)