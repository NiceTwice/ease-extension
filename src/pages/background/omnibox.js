let a = 0;

chrome.omnibox.setDefaultSuggestion(    {
      description: '<url>lala</url> <match>gmail</match> <dim>lala</dim>'
    }
);

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  a++;
  chrome.omnibox.setDefaultSuggestion(    {
        description: `${a}`
      }
  );
  const suggestions = [
    {
      content: 'facebook',
      description: 'Facebook perso'
    },
    {
      content: 'linkedin',
      description: 'linkedin PRO'
    },
    {
      content: 'GMail',
      description: '<url>lala</url> <match>gmail</match> <dim>lala</dim>'
    }
  ];
  suggest(suggestions);
});
