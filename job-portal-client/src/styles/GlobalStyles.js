const GlobalStyles = {
  container: {
    mt: 8,
  },
  card: {
    borderRadius: 5,
    mb: 2,
    p: 3,
    boxShadow: 2,
    transition: "0.3s",
    "&:hover": { boxShadow: 5, transform: "scale(1.02)" },
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    mb: 1,
  },
  company: {
    mb: 2,
    color: "textSecondary",
  },
  divider: {
    mb: 2,
  },
  experience: {
    fontWeight: "bold",
    mb: 2,
    color: "primary",
  },
  salary: {
    fontWeight: "bold",
    mb: 2,
    color: "#0a66c2",
  },
  location: {
    mb: 2,
    color: "#333",
  },
  skillsStack: {
    flexWrap: "wrap",
    mb: 2,
  },
  applyButton: {
    mt: 2,
    px: 4,
    py: 1,
    fontSize: "1rem",
  },
  jobDescription: {
    mb: 2,
    color: "#333",
  },

  // Newly added styles for Jobs.js
  pageTitle: {
    my: 4,
    textAlign: "left",
    fontWeight: "bold",
    color: "#0a66c2",
  },
  jobCard: {
    boxShadow: 2,
    transition: "0.3s",
    "&:hover": { boxShadow: 5, transform: "scale(1.02)" },
    borderRadius: 2,
    p: 2,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  jobAvatar: {
    bgcolor: "#0a66c2",
    width: 50,
    height: 50,
    mr: 2,
  },
  jobTitle: {
    fontWeight: "bold",
    color: "#0a66c2",
  },
  jobLocation: {
    color: "#666",
  },
  jobSalary: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  paginationBox: {
    display: "flex",
    justifyContent: "center",
    mt: 3,
  },
  noApplicationsText: {
    mt: 8
  }
};

export default GlobalStyles;
