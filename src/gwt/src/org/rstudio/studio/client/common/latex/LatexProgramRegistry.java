/*
 * LatexProgramRegistry.java
 *
 * Copyright (C) 2009-11 by RStudio, Inc.
 *
 * This program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */
package org.rstudio.studio.client.common.latex;

import java.util.ArrayList;

import org.rstudio.studio.client.workbench.model.Session;

import com.google.gwt.core.client.JsArrayString;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

@Singleton
public class LatexProgramRegistry
{
   @Inject
   public LatexProgramRegistry(Provider<Session> pSession)
   {
      pSession_ = pSession;
   }
  
   public String[] getTypeNames()
   {
      ArrayList<String> types = getTypes();
      String[] typeNames = new String[types.size()];
      for (int i=0; i< types.size(); i++)
         typeNames[i] = types.get(i);
      return typeNames;
   }
   
   public String getPrintableTypeNames()
   {
      StringBuffer str = new StringBuffer();
      String[] typeNames = getTypeNames();
      for (int i=0; i<typeNames.length; i++)
      {
         str.append(typeNames[i]);
         if (i != (typeNames.length - 1))
            str.append(", ");
         if (i == (typeNames.length - 2))
            str.append("and ");
      }
      return str.toString();
   }
   
   public ArrayList<String> getTypes()
   {
      if (latexProgramTypes_ == null)
      {
         JsArrayString types = 
                pSession_.get().getSessionInfo().getLatexProgramTypes();
       
         latexProgramTypes_ = new ArrayList<String>();
         for (int i=0; i<types.length(); i++)
            latexProgramTypes_.add(types.get(i));
      }
      return latexProgramTypes_;
   }
   
   public String findTypeIgnoreCase(String name)
   {
      for (String latexProgram : getTypes())
      {
         if (latexProgram.equalsIgnoreCase(name))
            return latexProgram;
      }
      
      return null;
   }

  
   
   private final Provider<Session> pSession_;
   private ArrayList<String> latexProgramTypes_ = null;
}
