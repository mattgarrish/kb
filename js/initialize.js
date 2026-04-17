
/* 
 * 
 * This file contains the KB class of functions, a set of callbacks
 * for copying examples, and the initiation code for each page.
 * It is only required that each page that needs formatting include
 * a reference to this script in its head, with page-specific
 * configuration done through a json object in the header.
 * 
 */


/* flip to https on site */

if (window.location.hostname.toLowerCase() === 'kb.daisy.org' && window.location.protocol === 'http:') {
  const httpsUrl = 'https://' + window.location.host + window.location.pathname + window.location.search + window.location.hash;
  window.location.replace(httpsUrl);
}

/* ------------ */


var lang = document.documentElement.lang ? document.documentElement.lang.toLowerCase() : 'en';


/* 
 * 
 * 
 * KB Class
 * - consider importing this over embedding if IE ever dies
 * 
 * 
 */

function KB() {
	
	this.shortForms = {};
		this.shortForms.en = {
			"Frequently Asked Questions": "FAQ"
		};
		this.shortForms.ja = {
		    "よくある質問": "よくある質問"
		};
	
	this.lang = lang;
	
	/*
	if (page_info.hasOwnProperty('404') && page_info['404']) {
		if (document.location.href.match('/ja/')) {
			lang = 'ja';
			this.lang = 'ja';
		}
	}
	*/
}

/* 
 * reformats the page for visual display depending on the hosting location (on the web or inside an ace browser view)
 */

KB.prototype.writeTemplate = function () {
	kb.generateMiniToc();
	if (page_info.hasOwnProperty('related')) {
		kb.generateRelatedTopics();
	}

}



/* 
 * generate the list of links to the sections on the page
 */

KB.prototype.generateMiniToc = function () {

	// grab all the subsection headings on the page
	var h = document.querySelectorAll('div#body h3');
	
	if (h.length > 0) {
	
		var ol = document.createElement('ol');
			ol.setAttribute('role', 'list');
			ol.setAttribute('id', 'mini-toc');
		
		// iterate each heading and add a link to it
		for (var i = 0; i < h.length; i++) {
			
			var li = document.createElement('li');
			var parent = h[i].parentNode;
			
			var a = document.createElement('a');
				a.setAttribute('href','#'+parent.id);
				
				// if a short form of a title is necessary for the menu, add to the shortForm section of the messages file
				var sectionName = h[i].textContent.trim();
					sectionName = this.shortForms[this.lang].hasOwnProperty(h[i].textContent) ? this.shortForms[this.lang][h[i].textContent] : h[i].textContent;
				
				a.appendChild(document.createTextNode(sectionName));
			 
			 li.appendChild(a);
			 
			 if (page_info.hasOwnProperty('addh4') && page_info.addh4) {
			 
			 	var h4 = parent.querySelectorAll('div#body h4');
			 	
			 	if (h4) {
			 	
			 		var sub_ol = document.createElement('ol');
			 		
			 		for (var j = 0; j < h4.length; j++) {
			 			
			 			var sub_li = document.createElement('li');
			 			
			 			var sub_a = document.createElement('a');
			 				sub_a.setAttribute('href', '#' + h4[j].parentNode.id);
			 				sub_a.appendChild(document.createTextNode(h4[j].textContent.trim()));
			 			
			 			sub_li.appendChild(sub_a);
			 			
			 			sub_ol.appendChild(sub_li);
			 			
			 		}
			 		
			 		li.appendChild(sub_ol);
			 	}
			 }
			 
			 ol.appendChild(li);
		}
		
		document.getElementById('mini-nav').appendChild(ol);
	}
}


/* creates a permalink for the specified content */

KB.prototype.createPermaLink = function(num, label, dest) {

	var a = document.createElement('a');
		a.href = '#' + dest;
		a.setAttribute('class', 'permalink');
		a.setAttribute('aria-label', msg.pageControl.permalink + label + ' ' + num);
		a.appendChild(document.createTextNode(msg.pageControl.permalinkSymbol));
	
	return a;

}

/* call the google pretty print function for examples */

KB.prototype.prettyPrint = function() {
	if (!this.isIndex && !this.isSearch && !this.isHomePage) {
		prettyPrint();
	}
}


/* add buttons to copy example text */

KB.prototype.addExampleCopy = function() {
	var ex = document.querySelectorAll('section#ex > figure > pre');
	
	for (var i = 0; i < ex.length; i++) {
		
		var input = document.createElement('input');
			input.setAttribute('type','button');
			input.setAttribute('value', msg.pageControl.copy);
			input.setAttribute('class','copy');
			
			input.addEventListener('click', copyExampleDelegate(ex[i].id), false);
		
		ex[i].insertAdjacentElement('afterEnd', input);
	}
}


/* add reference links */

KB.prototype.addHeadingDestinations = function() {

	var h3 = document.querySelectorAll('section > h3');
	
	for (var i = 0; i < h3.length; i++) {
		var dest = document.createElement('a');
			dest.setAttribute('class','dest');
			dest.href = '#' + h3[i].parentNode.id;
			dest.appendChild(document.createTextNode('\u00a7'));
		h3[i].prepend(document.createTextNode('\u00a0\u00a0'));
		h3[i].prepend(dest);
	}
}





/* 
 * 
 * 
 * INITIALIZATION
 * 
 * 
 * 
 */

var kb = new KB();

window.onload = function () {
	kb.generateMiniToc();
		
	var mini_toc = document.querySelector('nav.mini-toc');
	
	if (mini_toc) {
	
		let callback = (entries, observer) => {
	 		entries.forEach(entry => {
				var id = entry.target.getAttribute('id');
				
				var toc_entry = document.querySelector(`nav.mini-toc li a[href="#${id}"]`);
				
				if (toc_entry) {
					if (entry.intersectionRatio > 0) {
						toc_entry.parentElement.classList.add('active');
					}
					else {
						toc_entry.parentElement.classList.remove('active');
					}
					
				}
			});
		};
	
	
		var observer = new IntersectionObserver(callback, { rootMargin: '-94px 0px -200px 0px' } );
	
		document.querySelectorAll('section[id]').forEach((section) => {
			observer.observe(section);
		});
	}
	
	// split the long onix headings
	if (page_info.hasOwnProperty('category') && page_info.category.includes('meta-onix') && !window.location.pathname.match('index.html')) {
		var pg_title_elem = document.querySelector('div#page-title h2');
		var pg_title = pg_title_elem.innerText;
		
		pg_title_elem.innerHTML = '<span class="onix-num">' + pg_title.substring(0, pg_title.indexOf(':') + 1) + '</span><span class="onix-def">' + pg_title.substring(pg_title.indexOf(':') + 1) + '</span>';
	}

}




// ensure target location gets scrolled into view
var hash = window.location.hash;

if (hash) {
	
	var hash_id = hash.substring(1);
	var elem = document.getElementById(hash_id);
	
	if (elem) {
		elem.scrollIntoView();
	}
	
	if (hash_id.match(/^(faq|ex)-[0-9]+/)) {
		var scrolledY = window.scrollY;
		
		if(scrolledY){
			window.scroll(0, scrolledY - 140);
		}
	}
}


/* 
 * 
 * Change the page language
 * 
 */

function switchLanguage(elem) {
	var old_lang = lang === 'en' ? 'docs' : lang;
	var new_lang = elem.value === 'en' ? 'docs' : elem.value;
	document.location.href = document.location.href.replace('/'+old_lang+'/', '/'+new_lang+'/');
}


/* 
 * 
 * Example copying callback functions
 * 
 */


function copyExampleDelegate(ex_id) {
	return function(){
		copyExample(ex_id);
	}
}

function copyExample(ex_id) {

	// select the example
	var pre_orig = document.querySelector('pre#'+ex_id);
	
	// create a clone of the element to operate on
	var pre = pre_orig.cloneNode(true);
	
	// grab all the list items in the example (each li is a pretty-printed line of code)
	var li = pre.querySelectorAll('li');
	
	// add a line break to the end of each list item so formatting is retained when the li tags are stripped later
	for (var i = 0; i < li.length; i++) {
		li[i].appendChild(document.createTextNode('\n'));
	}
	
	// create a temporary textarea to copy the example out of and paste the text content of the example into it to remove any tags
	var textArea = document.createElement("textarea");
		textArea.value = pre.textContent;
	
	document.body.appendChild(textArea);
	
	textArea.select();
	
	// copy the example to the clipboard
	try {
		document.execCommand('copy');
		alert('Code successfully copied.')
	}
	catch (err) {
		console.error('Copy failed: ', err);
	}
	
	// discard the textarea
	document.body.removeChild(textArea);
}

