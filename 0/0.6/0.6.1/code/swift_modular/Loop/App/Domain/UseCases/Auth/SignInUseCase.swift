//
//  SignInUseCase.swift
//  Loop
//
//  Created by Kohji Onaja on 4/10/25.
//

import UIKit
import FirebaseAuth
import GoogleSignIn

protocol SignInUseCaseProtocol {
    func execute() async throws
}

class SignInWithGoogleUseCase: SignInUseCaseProtocol {
    func execute() async throws {
        guard let rootViewController = await UIApplication.shared.getRootViewController() else {
            throw NSError(domain: "SignIn", code: -1, userInfo: [NSLocalizedDescriptionKey: "No presenter"])
        }
        let signInResult = try await GIDSignIn.sharedInstance.signIn(withPresenting: rootViewController)
        guard let idToken = signInResult.user.idToken?.tokenString else {
            throw NSError(domain: "SignIn", code: -2, userInfo: [NSLocalizedDescriptionKey: "No idToken"])
        }
        let accessToken = signInResult.user.accessToken.tokenString
        let credential = GoogleAuthProvider.credential(withIDToken: idToken, accessToken: accessToken)
        let _ = try await Auth.auth().signIn(with: credential)
        await AuthMonitor.shared.doSetStatus(to: .loggedIn)
    }
}
