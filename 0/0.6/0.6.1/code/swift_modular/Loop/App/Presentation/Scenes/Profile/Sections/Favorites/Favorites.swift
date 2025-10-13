//
//  Favorites.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

struct Favorites: View {
    var body: some View {
        VStack {
            Text("Favoritos")
                .font(.system(size: 20, weight: .bold))
                .frame(maxWidth: .infinity, alignment: .leading)
            Text("Actualmente no tienes favoritos")
                .font(.system(size: 12, weight: .regular))
                .padding(.vertical, 30)
                .frame(maxWidth: .infinity)
                .background(.gray.opacity(0.1))
                .cornerRadius(10)
        }
    }
}

#Preview {
    Favorites()
}
