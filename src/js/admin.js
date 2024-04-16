import { getDatabase, getPage } from "./databaseAPI.js";
import config from "./config.js";
import axios from 'axios';

const initAdminCertsTable = async () => {
    const data = await getDatabase("4949e95213e94820934b6c8b3400df97");

    data.sort((a, b) => {
        return a.properties.piority.number - b.properties.piority.number;
      });

    data.map((item, index) => {
        const tableBody = document.querySelector(".cert-table__body");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.properties.title.title[0].plain_text}</td>
            <td><button class="cert-table__update" data-id="${item.properties.database_id.rich_text[0].plain_text}">Update</button></td>
        `
        tableBody.appendChild(row);
    });

    const updateButtons = document.querySelectorAll(".cert-table__update");
    updateButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");

            button.innerHTML = "Updating...";
            button.disabled = true;

            // const response = (await axios.patch('https://foliastudy.com/exam/api/v1/api/questions/update/' + id)).data;
            const response = (await axios.patch(`${config.apiUrl}/questions/update/` + id)).data;
            
            if (response.statusCode === 200) {
                button.innerHTML = "Updated";
                button.style.backgroundColor = "green";
                setTimeout(() => {
                    button.innerHTML = "Update";
                    button.style.backgroundColor = "blue";
                }, 3000);
                button.disabled = false;
            } else {
                console.log(response);
                button.innerHTML = "Error";
                button.style.backgroundColor = "red";
                button.disabled = false;
                setTimeout(() => {
                    button.innerHTML = "Try again";
                    button.style.backgroundColor = "blue";
                }, 3000);
            }
        });
    });
}

initAdminCertsTable();