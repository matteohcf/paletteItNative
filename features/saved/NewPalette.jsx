import { createSlice } from '@reduxjs/toolkit'

export const NewPalette = createSlice({
  name: 'NewPalette',
  initialState: {
    value: false,  /* Imposto il valore di default al valore dello storage di autenticazione cosi quando aggiorno la pagina lo tiene salvato */
  },
  reducers: {
    newPalette: (state) => { 
      state.value = true
    },
    notNewPalette: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { newPalette, notNewPalette } = NewPalette.actions

export default NewPalette.reducer