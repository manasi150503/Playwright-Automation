const {test, expect}=require('@playwright/test')

test("Handle dropdowns",async ({page})=>{

    await page.goto('https://testautomationpractice.blogspot.com/');

    // Multiple ways to select option from the dropdown
    //  await page.locator("#country").selectOption({label:'India'});  //label/visible text  option 1
    // await page.locator("#country").selectOption('India');           // visible text       option 2
    //  await page.locator("#country").selectOption({value:'uk'});                           option 3
    //   await page.locator("#country").selectOption({index: 1});                            option 4
    // await page.selectOption("#country",'India');                       // by text         option 5

// Assertions used
// 1) check number of options in dropdown   - Approach2
// const options=await page.locator('#country option')
// await expect(options).toHaveCount(10);

// 2) check number of options in dropdown - Approach2
// const options=await page.$$('#country option')
//console.log(Number of options:",options.length")
//await expect(options.length).toBe(10);

//3) check presence of value in the dropdown - Approach 1
    //  const content=await page.locator('#country').textContent()
    //  await expect(content.includes('India')).toBeTruthy();

//4) check presence of value in the dropdown - Approach 2 - using looping
    /* const options=await page.$$('#country option')
     let status=false;
     for(const option of options)
     {
       // console.log(await option.textContent())
       let value=await option.textContent();
       if(value.includes('France'))
      {
        status=true;
        break;
      }
    }
     expect(status).toBeTruthy();
     */ 

     //5) select option from dropdown using loop
    const options=await page.$$('#country option')
     let status=false;
     for(const option of options)
     {
       // console.log(await option.textContent())
       let value=await option.textContent();
       if(value.includes('France'))
      {
        status=true;
        break;
      }
    }
     expect(status).toBeTruthy();








    await page.waitForTimeout(5000);


})