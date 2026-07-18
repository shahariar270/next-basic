"use server";


export async function submitContact(formData) { 
    const name = formData.get('email');

    console.log({name});
}