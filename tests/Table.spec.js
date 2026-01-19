const {test, expect}=require('@playwright/test')

test("handling table",async ({page})=>{

    await page.goto('https://testautomationpractice.blogspot.com/');

    const table=await page.locator('#productTable')

    // 1) total number of rows & columns
    const columns= await table.locator('thead tr th')
    console.log('Number of columns:', await columns.count())   //4
    expect(await columns.count()).toBe(4)

   const rows=await table.locator('tbody tr')
   console.log('Number of columns:', rows.count())            //5
   expect(await rows.count()).toBe(5)

   // 2) select check box for Smartwatch [product 4]

//    const machedRow=rows.filter({
//         has: page.locator('td'),
//         hasText: 'Smartwatch'
//     })
//     await machedRow.locator('input').check()


// //3] select multiple products by re-usable function
// await selectProduct(rows,page,'Smartphone')
// await selectProduct(rows,page,'Tablet')
// await selectProduct(rows,page,'Wireless Earbuds')

  //4] print all product details using loop
   for(let i=0; i<await rows.count(); i++)
{
    const row=rows.nth(i);
        row.locator('td')

    for(let j=0 ;j<columns.count();j++)
    {
       await tds.nth(j).textContent()
    }
}
  





   await page.waitForTimeout(5000) 
})


async function selectProduct(rows, page, name)
{
    const machedRow=rows.filter({
         has: page.locator('td'),
         hasText: name
    })
     await machedRow.locator('input').check()
}