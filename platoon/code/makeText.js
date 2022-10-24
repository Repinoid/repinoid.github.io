function makeText(param) {	
	class Wtext extends google.maps.Marker {	
		constructor (args) {
				super(args) ;
				super.setOptions({clickable: false, draggable: false, icon: areaMarkerImage, }) ;
				this.name = "Text" ;
			}
		set figureColor(textColor) {
			const textLabel = this.getLabel() ;
			textLabel.color = textColor ;		
			this.setLabel(textLabel) ;			
		}	
		set figureText(txt) {
			this.setLabel({text: txt}) ;	
		}	
		get figureText() {
			return this.getLabel().text ;	
		}	
		set figureTextSize(size) {
			const textLabel = this.getLabel() ;
			textLabel.fontSize = size ;		
			this.setLabel(textLabel) ;			
		}	
		get figureTextSize() {
			const textLabel = this.getLabel() ;
			return textLabel.fontSize  ;		
		}	
		set figureOpacity(oppa) {
//			 this.setOpacity(oppa) ;
			 super.setOptions({opacity:	Number(oppa)}) ;
//			this.setOpacity(1) ;
		}
		set figureClickable(yn) {
			this.setOptions({clickable:	yn}) ;
		}
		get options() {
			const opts 	= {} ;
				opts.name 		= 	this.name ;
				opts.position 	= 	this.getPosition() ;
				opts.label 		= 	this.getLabel() ;
			return opts ;
		}
	}

	const areaMarkerImage = {
			url: './platoon/PIX/empty40.gif',
			labelOrigin: new google.maps.Point(80, 20),
		};
	const editingImage = {
			url: './platoon/PIX/editingText.gif',
			labelOrigin: new google.maps.Point(80, 20),
		};
		
	let textMarker = {} ;
	if ( ! param ) {
		textMarker = new Wtext ({										
									opacity: 		1,
									clickable:		true,
									draggable: 		true,
									title: 			"title", 
								
								}) ;
		textMarker.setPosition(karta.getCenter()) ;
		
		textMarker.figureText = " " ;
		textMarker.figureColor = figFillColor ;
		textMarker.figureTextSize = "30px" ;
//		textMarker.figureOpacity = figStrokeOpacity;
		figureEditFunction () ;
	}
	else {
		textMarker = new Wtext (param) ;
		textMarker.figureClickable = true ;
	}
	textMarker.setMap(karta) ;
	google.maps.event.addListener (textMarker, 'contextmenu', figureEditFunction) ;
	
	
	function figureEditFunction (event) {
		const isEditable = textMarker.getDraggable() ;
		if (isEditable) {
			txtForm.style.display = "none" ;
			textMarker.setIcon(areaMarkerImage) ;
			inputText.value = "" ;
		}
		else {
			txtForm.style.display = "block" ;
//			inputText.placeholder = "Введите текст" ;
			inputText.focus() ;
			inputText.value = textMarker.figureText ;
			const sizValSrt = Number(textMarker.figureTextSize.replace("px", ""))/10 ;
			fontSizeSlider.value = sizValSrt ;
			textMarker.setIcon(editingImage) ;
		}
		textMarker.setDraggable( ! isEditable) ;
	
		inputText.oninput = function() {		// при изменении строки ввода в форме
			const textLabel = textMarker.getLabel() ;
			textLabel.text = inputText.value ;		// change only text
			textMarker.setLabel(textLabel) ;
		}
		fontSizeSlider.onchange = function () {
			const textLabel = textMarker.getLabel() ;
			textLabel.fontSize = '' + this.value*10 + 'px' ;
			textMarker.setLabel(textLabel) ;
		}

	}
	
	return textMarker ;
}