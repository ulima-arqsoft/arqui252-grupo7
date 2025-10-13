//
//  ProfileViewModel.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI
import FirebaseAuth

@MainActor
class ProfileViewModel: ObservableObject {
    
    @Published var displayedUser: DisplayedUser = .init(profilePicLetter: "", name: "", email: "")
    
    func doFetchUser() {
        let user = Auth.auth().currentUser
        let userName = user?.displayName ?? ""
        let userEmail = user?.email ?? ""
        displayedUser = .init(
            profilePicLetter: String(userName.prefix(1)),
            name: userName,
            email: userEmail
        )
    }
}
