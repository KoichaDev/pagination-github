document.addEventListener('DOMContentLoaded', () => {
    const fetchAPI = async (url) => {
        try {
            const res = await fetch(url);
            return await res.json();
        } catch (err) {
            console.log(err);
        }
    };

    fetchAPI('https://api.github.com/search/repositories?q=language%3Ajavascript&sort=stars&order=desc&per_page=100')
        .then(res => {
            const tbody = document.querySelector('.rwd-table > tbody');
            const apiArray = res.items;

            let currentPage = 1;
            const displayRows = 20;

            if (res) {
                document.querySelector('.spinner').style.display = 'none';
                document.querySelector('.rwd-table').style.display = 'block';
            }

            createTableRow(apiArray, tbody, displayRows, currentPage);
            setupPaginationNumbers(apiArray, tbody, displayRows, currentPage);

        }).catch(err => console.log(err));

    const createTableRow = (array, tableBody, rowsPerPage, page) => {
        // Will reset the page list of the table every time we click on a new pagination number
        tableBody.innerHTML = '';

        // we need to decrement the value, because the current Page is value on 1, but the index position of the array is 0
        // so 1-0 = 0, so we start in 0 position from the array for the page
        page--;

        // We are going to loop through the array in certain amount
        const start = rowsPerPage * page;
        const end = start + rowsPerPage;

        // Making sure to use slice, so we can decide how many start and the end of the array
        const paginatedItems = array.slice(start, end);

        for (let i = 0; i < paginatedItems.length; i++) {

            const { name, owner: avatar_url, owner: html_url, watchers } = paginatedItems[i];

            const tr = document.createElement('tr');
            const td = document.createElement('td');
            const img = document.createElement('img');
            const a = document.createElement('a');

            tableBody.appendChild(tr);

            // AppendChild Multiple times with the same node
            for (let i = 0; i < 3; i++) {
                const sibling = tr.appendChild(td);
                sibling.parentNode.insertBefore(td.cloneNode(), sibling.nextSibling);
            }

            tr.children[0].setAttribute('data-th', 'Avatar');
            tr.children[1].setAttribute('data-th', 'Name');
            tr.children[2].setAttribute('data-th', 'Github URL');
            tr.children[3].setAttribute('data-th', 'Watchers');

            img.src = avatar_url.avatar_url;
            img.width = '50';
            img.height = '50';

            a.href = html_url.html_url;
            a.innerText = html_url.html_url;

            tr.children[0].appendChild(img);
            tr.children[2].appendChild(a);

            tr.children[1].innerText = name;
            tr.children[3].innerText = watchers;
        }
    };

    const setupPaginationNumbers = (array, tableBody, rowPerPage, currentPage) => {
        const paginationElement = document.querySelector('#pagination');

        // Reason we want to round up is depends how many items exist on the array. Currently we have 22 items, and if we take 22/5 (page)
        // then we get 4.4. What we want is to round up and get an absolute number that is 4, so we get our pagination to be 
        // page 4, not 4.4 for example.
        const countPage = Math.ceil(array.length / rowPerPage);

        // Looping through to find total numbers for the button to display on the site based on the 
        // array length, since we take consideration of the rows we wish to display on the site
        for (let paginationNumber = 1; paginationNumber < countPage + 1; paginationNumber++) {

            const paginationButton = document.createElement('button');

            paginationElement.appendChild(paginationButton);

            paginationButton.innerText = paginationNumber;

            if (currentPage === paginationNumber) paginationButton.classList.add('active');

            paginationButton.addEventListener('click', () => {
                const currentBtn = document.querySelector('.page-numbers button.active');

                currentPage = paginationNumber;

                createTableRow(array, tableBody, rowPerPage, currentPage);

                currentBtn.classList.remove('active');
                paginationButton.classList.add('active');
            });
        }
    };
});