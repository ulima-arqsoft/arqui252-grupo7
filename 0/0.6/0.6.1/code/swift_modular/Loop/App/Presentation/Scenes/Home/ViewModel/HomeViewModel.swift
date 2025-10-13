//
//  HomeViewModel.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

@MainActor
class HomeViewModel: ObservableObject {
    
    let router: Router?
    
    init(router: Router?) {
        self.router = router
    }
}

