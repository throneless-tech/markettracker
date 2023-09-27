const formatDate = (dateDate) => {
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", options);
}

export default formatDate;