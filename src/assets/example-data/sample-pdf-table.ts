export const sampleTable = {
    content: [
        {
            text: 'WEEK-WERKBRIEFJE', 
            style: 'header'
        },
        {
            text: 'Week nr. 46', 
            style: 'subheader'
        },
        
        {
            text: 'Ingevuld door Willem Waanders',
            bold: true
        },
        {
            text: 'Van maandag 23 november t/m woensdag 25 november 2018', 
            bold: true
        },
        {
            style: 'tableExample',
            margin: [0, 25],
            table: {
                headerRows: 2,
                heights: [30, 40, 40, 40, 40],
                widths: [110, 50, '*', 180],
                body: [
                    [{text: 'Datum', style: 'tableHeader'}, {text: 'Aantal uren', style: 'tableHeader'}, {text: 'Aannemer/klant', style: 'tableHeader'}, {text: 'Werkzaamheden', style: 'tableHeader'}],
                    [
                        'Maandag 23 nov',
                        '7 uur en 30 min.',
                        [{text: 'ProWonen Borculo'}, {text: 'Sprengersstraat 42', color: 'gray'}],
                        {
                            ul: [
                                'Kozijnen geschilderd',
                                'Plafond gesausd'
                            ]
                        }
                    ],
                    [
                        'Dinsdag 24 nov',
                        '7 uur en 30 min.',
                        [{text: 'ProWonen Borculo'}, {text: 'Sprengersstraat 42', color: 'gray'}],
                        {
                            ul: [
                                'Inboedel verhuisd',
                                'Schuren van trapleuning',
                                'Rookruimte gesausd'
                            ]
                        }
                    ],
                    [
                        'Woensdag 25 nov',
                        '7 uur en 30 min.',
                        [{text: 'Zorggroep Apeldoorn'}, {text: 'Kasteellaan 187', color: 'gray'}],
                        {
                            ul: [
                                'Kozijnen gegerond',
                                'Voordeur gelakt.'
                            ]
                        }
                    ],
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
    }
}