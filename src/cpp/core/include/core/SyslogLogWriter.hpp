/*
 * SyslogLogWriter.hpp
 *
 * Copyright (C) 2009-12 by RStudio, Inc.
 *
 * This program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

#ifndef SYSLOG_LOG_WRITER_HPP
#define SYSLOG_LOG_WRITER_HPP

#include <core/LogWriter.hpp>

namespace core {

class SyslogLogWriter : public LogWriter
{
public:
    SyslogLogWriter(const std::string& programIdentity, int logLevel);
    virtual ~SyslogLogWriter();
    virtual void log(core::system::LogLevel level,
                     const std::string& message);
};

} // namespace core

#endif // SYSLOG_LOG_WRITER_HPP
