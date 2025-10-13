//
//  MainViewModel+Routes.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import Foundation

extension MainViewModel {
    
    func navigateToLoginView() {
        router?.showCustomSheet(.automatic, onDismiss: nil) { _ in
            LoginBuilder.build()
        }
    }
    
    func navigateToSignInView() {
        router?.showCustomSheet(.automatic, onDismiss: nil) { _ in
            SignInBuilder.build()
        }
    }
}
