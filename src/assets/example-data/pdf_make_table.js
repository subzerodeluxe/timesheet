// playground requires you to assign document definition to a variable called dd

var dd = {
	content: [
		{text: 'WEEK-WERKBRIEFJE', style: 'header'},
		{text: 'Week nr. 46', style: 'subheader'},
        
		{text: ['Ingevuld door Willem Waanders'], bold: true},
		{text: ['Van maandag 12 november t/m vrijdag 16 november 2018'], bold: true},
		{
			style: 'tableExample',
			margin: [0, 25],
			table: {
				headerRows: 2,
                heights: [30, 40, 40, 40, 40],
                widths: ['*', 50, '*', 200],
				body: [
					[{text: 'Datum', style: 'tableHeader'}, {text: 'Aantal uren', style: 'tableHeader'}, {text: 'Aannemer/klant', style: 'tableHeader'}, {text: 'Werkzaamheden', style: 'tableHeader'}],
					[
						'Maandag 12 nov',
						'7.5',
					    'Needse molen',
					    'Onderwerk: schilderen en afnemen'
					],
					[
					    'Dinsdag 13 nov',
						'3',
					    'Needse molen',
					    'Onderwerk: schilderen en afnemen'
					],
					[
					    'Dinsdag 13 nov',
						'4.5',
					    'High Tech Borculo',
					    'Schuren en voorwerk plafond'
					],
					[
					    'Dinsdag 13 nov',
						'4.5',
					    'High Tech Borculo',
					    'Schuren en voorwerk plafond'
					]
				]
			}
		},
			{
			stack: [
				'Totaal: 30 uur',
				{text: 'Kenteken auto: 45-XD-33', style: 'block'},
				{text: 'Kilometerstand: 125.034', style: 'small'}
			],
			style: 'totalHeader'
		}
	],
	styles: {
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 10]
		},
        totalHeader: {
            fontSize: 18,
			bold: true,
			alignment: 'left',
			margin: [0, 0, 0, 0]
        },
         block: {
            fontSize: 13,
			bold: true,
			alignment: 'left',
			margin: [0, 20, 0, 0]
        },
        small: {
            fontSize: 13,
			bold: true,
			alignment: 'left',
			margin: [0, 0, 0, 0]
        },
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 15]
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black'
		}
	},
	defaultStyle: {
		// alignment: 'justify'
	}
	
}

