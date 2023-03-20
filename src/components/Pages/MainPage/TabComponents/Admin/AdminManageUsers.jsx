import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Stack } from "@mui/system";
import {
	Paper,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Modal,
	Button,
} from "@mui/material";

export default function AdminManageUsers() {

	const dispatch = useDispatch();

	// Access redux stores for users
	const unverifiedUsers = useSelector((store) => store.unverifiedUsersReducer);
	const verifiedUsers = useSelector((store) => store.verifiedUsersReducer);

	const infoOfSpecificUser = useSelector(
		(store) => store.viewAccountInfoReducer
	);
	const [isPromoteDisplayed, setIsPromoteDisplayed] = useState(true);

	// Manage opening and closing of details modal
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);


	const handleApprove = () => {
		console.log("Approve button clicked");
		dispatch({ type: "APPROVE_USER_REQUEST", payload: infoOfSpecificUser });
	
		handleClose();
	};


	const handleDeny = () => {
		console.log("Deny button clicked");
		dispatch({ type: "DENY_USER_REQUEST", payload: infoOfSpecificUser });
		handleClose();
	};
	// const handleClick = () => {
	// 	for (let x = 0; x < verifiedUsers.length; x++) {
	// 		if (verifiedUsers[x].is_admin === true) {
	// 			handleDemote();
	// 		}
	// 		if (verifiedUsers[x].is_admin === false) {
	// 			handlePromote();
	// 		}
	// 	}
	// }
	const handlePromote = () => {
		console.log("Promote button clicked");
		dispatch({ type: "PROMOTE_USER", payload: infoOfSpecificUser });
		setIsPromoteDisplayed(false); 
	}

	const handleDemote = () => {
		console.log("Demote button clicked");
		dispatch({ type: "DEMOTE_USER", payload: infoOfSpecificUser });
		setIsPromoteDisplayed(true);
	}
	return (
		<div>
			<Stack spacing={3}>
				<Paper sx={{ p: 3 }}>
					{/* <pre>{JSON.stringify(unverifiedUsers)}</pre> */}
					<Typography>Users awaiting approval</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone Number</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{unverifiedUsers.map((user) => (
								<TableRow
									key={user.id}
									onClick={() => {
										handleOpen();
										dispatch({ type: "VIEW_ACCOUNT_INFO", payload: user });
									}}
								>
									<TableCell>
										{user.first_name} {user.last_name}
									</TableCell>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.phone_number}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Modal
						open={open}
						onClose={() => {
							handleClose();
							dispatch({ type: "UNVIEW_ACCOUNT_INFO" });
						}}
					>
						<Stack
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Paper
								sx={{
									display: "flex",
									flexDirection: "column",
									padding: "20px",
								}}
							>
								{/* <pre>{JSON.stringify(infoOfSpecificUser)}</pre> */}
								<Typography
									variant="h4"
									component="h2"
									sx={{ textDecoration: "underline" }}
								>
									User Info
								</Typography>
								<br />
								<Typography variant="h6" component="h4">
									Name: {infoOfSpecificUser.first_name}{" "}
									{infoOfSpecificUser.last_name}
								</Typography>
								<br />
								<Typography variant="h6" component="h4">
									Email: {infoOfSpecificUser.username}
								</Typography>
								<br />
								<Typography variant="h6" component="h4">
									Phone Number: {infoOfSpecificUser.phone_number}
								</Typography>
								<br />
								<Typography variant="h6" component="h4">
									Created at:
								</Typography>
								{infoOfSpecificUser.is_verified ? (
									<>
										<Button variant="contained">Promote</Button>
										<Button variant="contained">Delete</Button>
									</>
								) : (
									<>
										<Button variant="contained" onClick={handleApprove}>
											Approve
										</Button>

										<Button variant="contained" onClick={handleDeny}>
											Deny
										</Button>
									</>
								)}

							</Paper>
						</Stack>
					</Modal>
				</Paper>
				<Paper sx={{ p: 3 }}>
					<Typography>All Users</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone Number</TableCell>
								<TableCell>Verified</TableCell>
								<TableCell>Admin</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{verifiedUsers.map((user) => (
								<TableRow
									key={user.id}
									onClick={() => {
										handleOpen();
										dispatch({ type: "VIEW_ACCOUNT_INFO", payload: user });
									}}
								>
									<TableCell>
										{user.first_name} {user.last_name}
									</TableCell>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.phone_number}</TableCell>
									<TableCell>{user.is_verified ? "Yes" : "No"}</TableCell>
									<TableCell>{user.is_admin ? "Yes" : "No"}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Modal
						open={open}
						onClose={() => {
							handleClose();
							dispatch({ type: "UNVIEW_ACCOUNTS_INFO" });
						}}
					>
						<Stack
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Paper
								sx={{
									display: "flex",
									flexDirection: "column",
									padding: "20px",
								}}
							>
								<Typography
									variant="h4"
									component="h2"
									sx={{ textDecoration: "underline" }}
								>
									User Info
								</Typography>
								<br />
								<Typography variant="h6" component="h4">
									Name: {infoOfSpecificUser.first_name} {infoOfSpecificUser.last_name}
								</Typography>
								<br />
								<Typography variant="h6" component="h4">
									Email: {infoOfSpecificUser.username}
								</Typography>
								<br />
								<Typography variant="h6" component="h4">
									Phone Number: {infoOfSpecificUser.phone_number}
								</Typography>
								<br />
								<Typography variant="h6" component="h4">
									Created at:
								</Typography>
								{infoOfSpecificUser.is_verified ? (
									<>
										{infoOfSpecificUser.is_admin === false ? (
											<>
												<Button variant="contained" onClick={handlePromote}>
													Promote
												</Button>
											</>
										) : (
											<>
												<Button variant="contained" onClick={handleDemote}>
													Demote
												</Button>
											</>
										)}
										<Button variant="contained" onClick={handleDeny}>Delete</Button>
									</>
								) : (
									<>
										<Button variant="contained" onClick={handleApprove}>
											Approve
										</Button>
										<Button variant="contained" onClick={handleDeny}>
											Deny
										</Button>
									</>
								)}
							</Paper>
						</Stack>
					</Modal>
				</Paper>
			</Stack>
		</div>
	);
}
