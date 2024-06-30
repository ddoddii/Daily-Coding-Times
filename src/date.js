export function getCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    console.log("✅ : today's date updated : ", today.toLocaleDateString('en-US', options))
    return today.toLocaleDateString('en-US', options);
}
