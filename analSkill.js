const XLSX = require('xlsx');

// const filePath = './AnalSkill.xlsx';
const filePath = './SkillsFuture Framework_TSC_CCS.xlsx';

const jobRoleInput = 'Data Engineer'; // Example job role input

const workbook = XLSX.readFile(filePath);
const jobRoleSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Job Role_TCS_CCS']);
const ccsSheet = XLSX.utils.sheet_to_json(workbook.Sheets['CCS']);

// Filter job roles to match the input

const filteredRoles = jobRoleSheet.filter(row => row['Job Role'] === jobRoleInput);

// Extract the unique CCS_TSC Titles for the filtered job roles
const uniqueSkills = [...new Set(filteredRoles.map(row => row['CCS_TSC Title']))];

// Assuming your skills list is defined as follows
const skillsList = uniqueSkills

// Convert the skills list into a Set for efficient lookup
const skillsSet = new Set(skillsList);

// Assuming ccsSheet is loaded with the "CCS" sheet data
let skillDetails = {};

// Traverse the "CCS" sheet once
ccsSheet.forEach(row => {
    const skill = row['TSC_CCS Title'];

    // Check if the current row's skill is in the set of required skills
    if (skillsSet.has(skill)) {
        // Initialize the skill entry in skillDetails if it doesn't exist
        if (!skillDetails[skill]) {
            skillDetails[skill] = {
                description: row['TSC_CCS Description'], // Capture the description (assumes first encountered description is used)
                items: new Set() // Use a Set to automatically ensure unique items
            };
        }

        // Add the item to the Set (this automatically handles duplicates)
        skillDetails[skill].items.add(row['Knowledge / Ability Items']);
    }
});

// Convert item Sets back into arrays for each skill
Object.keys(skillDetails).forEach(skill => {
    skillDetails[skill].items = Array.from(skillDetails[skill].items);
});


const finalResult = {
    [jobRoleInput] : skillDetails
}


console.log(JSON.stringify(finalResult, null, 2));

