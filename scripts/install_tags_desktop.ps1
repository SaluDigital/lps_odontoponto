$path = (Get-Item 'C:\Users\dnzwe\OneDrive\*Trabalho\index.html').FullName
$content = [System.IO.File]::ReadAllText($path)

$headSnippet = @"
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-447050268"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-447050268');
        gtag('config', 'G-0Q8Z52JRS4');
        gtag('config', 'UA-52637203-11');
    </script>

    <!-- Google Tag Manager -->
    <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-KQVFZHS');
    </script>
"@

$bodySnippet = @"
<body>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KQVFZHS"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
"@

$content = $content.Replace('</head>', "$headSnippet`r`n</head>")
$content = $content.Replace('<body>', $bodySnippet)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
