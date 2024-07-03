import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function getTrendingRepos() {
    const url = 'https://github.com/trending?since=weekly&spoken_language_code=';
    const response = await fetch(url);
    const text = await response.text();
    const dom = new JSDOM(text);
    const document = dom.window.document;

    const repos = [];
    const repoElements = document.querySelectorAll('article.Box-row');

    for (let i = 0; i < 10 && i < repoElements.length; i++) {
        const repoElement = repoElements[i];
        const nameElement = repoElement.querySelector('h2 a');
        const descriptionElement = repoElement.querySelector('p');
        
        const name = nameElement.href.slice(1);
        const href = 'https://github.com/' + name;
        const description = descriptionElement ? descriptionElement.textContent.trim() : 'No description available';

        repos.push({ name, href, description });
    }

    return repos;
}

export {getTrendingRepos};