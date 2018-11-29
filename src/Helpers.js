import removePunctuation from 'remove-punctuation';

const formatForId = value => removePunctuation(value).replace(/ /g, '').replace('|', '').replace(/-/g, '').toLowerCase().slice(0,20);

export default formatForId;